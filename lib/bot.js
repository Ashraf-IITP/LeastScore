// lib/bot.js - Hard Difficulty AI Bot for LeastScore card game
// Implements: card memory, hand optimization, EV-based draw decisions,
// per-opponent modeling, sequence-aware discards, defensive declaration.

const { SUITS, RANKS, RANK_VALUES, RANK_ORDER } = require('./types');
const { calculateSum, isValidDiscard } = require('./hand');

// ─── Difficulty Calibration Parameters ──────────────────────────────────────
const BOT_CONFIG = {
  riskThreshold: 0.20,       // 20% — declare if risk of losing < this
  memoryAccuracy: 1.0,       // 100% for hard bot
  aggressionLevel: 0.6,      // 0-1 scale, higher = more willing to declare early
};

// ─── Bot State Factory ──────────────────────────────────────────────────────
function createBotState() {
  return {
    seenCards: [],           // All revealed cards (drawn + discarded)
    discardHistory: [],      // Ordered list of { card, byPlayer }
    perOpponent: {},         // { [playerIndex]: { pickups: [], discards: [], deckDraws: 0 } }
    turnCount: 0,
    pendingObservations: [],
  };
}

// ─── Card Memory System ─────────────────────────────────────────────────────
function recordSeenCards(botState, cards) {
  for (const card of cards) {
    if (!botState.seenCards.some(c => c.suit === card.suit && c.rank === card.rank)) {
      botState.seenCards.push({ ...card });
    }
  }
}

function recordDiscard(botState, cards, byPlayer) {
  for (const card of cards) {
    botState.discardHistory.push({ card: { ...card }, byPlayer });
  }
  recordSeenCards(botState, cards);
}

function getOpponentData(botState, playerIndex) {
  if (!botState.perOpponent[playerIndex]) {
    botState.perOpponent[playerIndex] = { pickups: [], discards: [], deckDraws: 0 };
  }
  return botState.perOpponent[playerIndex];
}

function recordOpponentPickup(botState, card, byPlayer) {
  const opp = getOpponentData(botState, byPlayer);
  opp.pickups.push({ ...card });
  recordSeenCards(botState, [card]);
}

function recordOpponentDiscard(botState, cards, byPlayer) {
  const opp = getOpponentData(botState, byPlayer);
  for (const card of cards) {
    opp.discards.push({ ...card });
  }
  recordSeenCards(botState, cards);
}

function recordOpponentDeckDraw(botState, byPlayer) {
  const opp = getOpponentData(botState, byPlayer);
  opp.deckDraws++;
}

function getRemainingDeckDistribution(botState, botHand) {
  const fullDeck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      fullDeck.push({ suit, rank });
    }
  }
  const knownCards = [...botState.seenCards];
  for (const card of botHand) {
    if (!knownCards.some(c => c.suit === card.suit && c.rank === card.rank)) {
      knownCards.push(card);
    }
  }
  return fullDeck.filter(dc => !knownCards.some(kc => kc.suit === dc.suit && kc.rank === dc.rank));
}

// ─── Hand Optimization Engine ───────────────────────────────────────────────
function rankOrd(rank) { return RANK_ORDER[rank]; }

function isSequenceGroup(cards) {
  if (cards.length < 3) return false;
  const orders = cards.map(c => rankOrd(c.rank));
  const unique = [...new Set(orders)].sort((a, b) => a - b);
  if (unique.length !== cards.length) return false;
  if (unique[unique.length - 1] - unique[0] === unique.length - 1) return true;
  for (const start of unique) {
    let valid = true;
    for (let offset = 0; offset < unique.length; offset++) {
      const expected = (start + offset) % 13;
      if (!unique.includes(expected)) { valid = false; break; }
    }
    if (valid) return true;
  }
  return false;
}

function findAllValidDiscards(hand) {
  const combos = [];
  for (let i = 0; i < hand.length; i++) combos.push([hand[i]]);
  for (let i = 0; i < hand.length; i++) {
    for (let j = i + 1; j < hand.length; j++) {
      if (hand[i].rank === hand[j].rank) combos.push([hand[i], hand[j]]);
    }
  }
  for (let i = 0; i < hand.length; i++) {
    for (let j = i + 1; j < hand.length; j++) {
      for (let k = j + 1; k < hand.length; k++) {
        const trio = [hand[i], hand[j], hand[k]];
        if (isSequenceGroup(trio)) combos.push(trio);
      }
    }
  }
  for (let i = 0; i < hand.length; i++) {
    for (let j = i + 1; j < hand.length; j++) {
      for (let k = j + 1; k < hand.length; k++) {
        for (let l = k + 1; l < hand.length; l++) {
          const quad = [hand[i], hand[j], hand[k], hand[l]];
          if (quad.every(c => c.rank === quad[0].rank)) combos.push(quad);
        }
      }
    }
  }
  if (hand.length >= 5) {
    for (let i = 0; i < hand.length; i++) {
      for (let j = i + 1; j < hand.length; j++) {
        for (let k = j + 1; k < hand.length; k++) {
          for (let l = k + 1; l < hand.length; l++) {
            for (let m = l + 1; m < hand.length; m++) {
              const quint = [hand[i], hand[j], hand[k], hand[l], hand[m]];
              if (isSequenceGroup(quint) || quint.every(c => c.suit === quint[0].suit)) combos.push(quint);
            }
          }
        }
      }
    }
  }
  return combos;
}

function scoreAfterDiscard(hand, discardCards) {
  const remaining = hand.filter(hc => !discardCards.some(dc => dc.suit === hc.suit && dc.rank === hc.rank));
  return calculateSum(remaining);
}

// ─── Sequence Potential Bonus ───────────────────────────────────────────────
// Reward keeping cards that are 1 rank away from forming a 3-card sequence
function sequencePotentialBonus(remainingHand) {
  let bonus = 0;
  for (let i = 0; i < remainingHand.length; i++) {
    for (let j = i + 1; j < remainingHand.length; j++) {
      const a = rankOrd(remainingHand[i].rank);
      const b = rankOrd(remainingHand[j].rank);
      const diff = Math.abs(a - b);
      // Adjacent cards (diff=1) or one gap (diff=2) have sequence potential
      if (diff === 1) bonus -= 1.5; // Adjacent pair: strong potential
      else if (diff === 2) bonus -= 0.5; // One-gap pair: moderate potential
      // Circular adjacency (e.g., K-A or Q-K-A)
      const circDiff = Math.min(Math.abs(a - b), 13 - Math.abs(a - b));
      if (circDiff === 1 && diff !== 1) bonus -= 1.0;
    }
  }
  return bonus;
}

function findBestDiscard(hand, botState, nextPlayerModel) {
  const validDiscards = findAllValidDiscards(hand);
  if (validDiscards.length === 0) return null;

  let bestDiscard = null;
  let bestScore = Infinity;
  let bestPenalty = 0;

  for (const discard of validDiscards) {
    const remainingHand = hand.filter(hc => !discard.some(dc => dc.suit === hc.suit && dc.rank === hc.rank));
    const remaining = calculateSum(remainingHand);
    const seqBonus = sequencePotentialBonus(remainingHand);

    // Penalty only for the next player in turn order (only they can pick up the discard)
    let opponentBenefit = 0;
    if (nextPlayerModel) {
      for (const card of discard) {
        if (isLikelyUsefulToOpponent(card, nextPlayerModel)) {
          opponentBenefit += RANK_VALUES[card.rank] * 0.2;
        }
      }
    }

    const adjustedScore = remaining + seqBonus + opponentBenefit;
    if (adjustedScore < bestScore) {
      bestScore = adjustedScore;
      bestDiscard = discard;
      bestPenalty = opponentBenefit;
    }
  }

  return { discard: bestDiscard, remainingScore: bestScore - bestPenalty, opponentPenalty: bestPenalty };
}

// ─── Per-Opponent Modeling System ───────────────────────────────────────────
function buildOpponentModel(botState, opponentIndex) {
  const opp = getOpponentData(botState, opponentIndex);
  const model = {
    playerIndex: opponentIndex,
    discardedRanks: {},
    discardedSuits: {},
    pickedUpCards: [...opp.pickups],
    preferredSuits: [],
    avoidedSuits: [],
    deckDraws: opp.deckDraws,
    estimatedScoreRange: [5, 50],
    looksCloseToDeclaration: false,
    estimatedHandSize: 5,
  };

  for (const card of opp.discards) {
    model.discardedRanks[card.rank] = (model.discardedRanks[card.rank] || 0) + 1;
    model.discardedSuits[card.suit] = (model.discardedSuits[card.suit] || 0) + 1;
  }

  const pickupSuitCount = {};
  for (const card of opp.pickups) {
    pickupSuitCount[card.suit] = (pickupSuitCount[card.suit] || 0) + 1;
  }

  const discardSuitCount = {};
  for (const card of opp.discards) {
    discardSuitCount[card.suit] = (discardSuitCount[card.suit] || 0) + 1;
  }

  const sortedDiscardSuits = Object.entries(discardSuitCount).sort((a, b) => b[1] - a[1]);
  if (sortedDiscardSuits.length > 0) model.avoidedSuits = sortedDiscardSuits.slice(0, 2).map(e => e[0]);

  const sortedPickupSuits = Object.entries(pickupSuitCount).sort((a, b) => b[1] - a[1]);
  if (sortedPickupSuits.length > 0) model.preferredSuits = sortedPickupSuits.map(e => e[0]);

  // Smarter score estimation factoring in turns, draw behavior, and discard values
  const turns = botState.turnCount;
  const totalMoves = opp.pickups.length + opp.deckDraws; // actual opponent turns
  const avgDiscardValue = opp.discards.length > 0
    ? opp.discards.reduce((s, c) => s + RANK_VALUES[c.rank], 0) / opp.discards.length
    : 7;
  const pickupCount = opp.pickups.length;
  const visibleDrawRatio = totalMoves > 0 ? pickupCount / totalMoves : 0;

  if (turns <= 2) {
    model.estimatedScoreRange = [10, 45];
  } else if (turns <= 5) {
    if (avgDiscardValue >= 9) model.estimatedScoreRange = [5, 22];
    else if (avgDiscardValue >= 6) model.estimatedScoreRange = [8, 32];
    else model.estimatedScoreRange = [15, 45];
  } else {
    if (avgDiscardValue >= 8 && pickupCount >= 2) model.estimatedScoreRange = [3, 15];
    else if (avgDiscardValue >= 6) model.estimatedScoreRange = [5, 25];
    else model.estimatedScoreRange = [10, 38];
  }

  // High visible draw ratio + high discard values = very targeted play
  if (visibleDrawRatio > 0.5 && avgDiscardValue >= 7) {
    model.estimatedScoreRange[1] = Math.max(model.estimatedScoreRange[0], model.estimatedScoreRange[1] - 5);
  }

  // Estimate opponent hand size: start with 5, each turn draws 1 and discards N
  // Opponent turns = pickups (visible draws) + deckDraws (blind draws)
  const opponentTurns = opp.pickups.length + opp.deckDraws;
  const totalCardsDiscarded = opp.discards.length;
  // handSize = 5 + turns_played - total_cards_discarded
  model.estimatedHandSize = Math.max(1, Math.min(6, 5 + opponentTurns - totalCardsDiscarded));

  // Clamp score range based on hand size (only 4 copies of each rank in deck)
  // Min: N lowest cards = 4×A(1) then 4×2(2) etc. Max: N highest = 4×K(13) then 4×Q(12) etc.
  const MIN_BY_HAND = [0, 1, 2, 3, 4, 6, 8];   // idx=handSize: 0,1,2,3,4, 4A+2, 4A+2×2
  const MAX_BY_HAND = [0, 13, 26, 39, 52, 64, 76]; // 4K+Q, 4K+2Q
  const hs = model.estimatedHandSize;
  if (hs >= 1 && hs <= 6) {
    model.estimatedScoreRange[0] = Math.max(model.estimatedScoreRange[0], MIN_BY_HAND[hs]);
    model.estimatedScoreRange[1] = Math.min(model.estimatedScoreRange[1], MAX_BY_HAND[hs]);
    // Ensure min <= max after clamping
    if (model.estimatedScoreRange[0] > model.estimatedScoreRange[1]) {
      model.estimatedScoreRange[0] = model.estimatedScoreRange[1];
    }
  }

  // Defensive declaration trigger: opponent looks close to declaring
  if (turns >= 3 && avgDiscardValue >= 8 && pickupCount >= 2) {
    model.looksCloseToDeclaration = true;
  }
  if (turns >= 5 && avgDiscardValue >= 7) {
    model.looksCloseToDeclaration = true;
  }

  return model;
}

function buildAllOpponentModels(botState, gameState, botIndex) {
  const models = [];
  for (let i = 0; i < gameState.players.length; i++) {
    if (i === botIndex) continue;
    if (gameState.players[i].eliminated) continue;
    models.push(buildOpponentModel(botState, i));
  }
  return models;
}

function isLikelyUsefulToOpponent(card, opponentModel) {
  // Suit preference only matters for 5-card same-suit combo; skip if opponent has <5 cards
  if (opponentModel.estimatedHandSize >= 5 && opponentModel.preferredSuits.includes(card.suit)) return true;
  if (opponentModel.pickedUpCards.some(pc => pc.rank === card.rank)) return true;
  if (RANK_VALUES[card.rank] <= 3) return true;

  // Sequence detection: if opponent picked up 2 adjacent-rank cards,
  // avoid discarding a rank that completes their 3-card sequence.
  const pickups = opponentModel.pickedUpCards;
  if (pickups.length >= 2) {
    const cardOrd = RANK_ORDER[card.rank];
    for (let i = 0; i < pickups.length; i++) {
      for (let j = i + 1; j < pickups.length; j++) {
        const a = RANK_ORDER[pickups[i].rank];
        const b = RANK_ORDER[pickups[j].rank];
        // Check if a and b are adjacent (diff=1) and card completes the sequence
        const diff = Math.abs(a - b);
        if (diff === 1) {
          const lo = Math.min(a, b);
          const hi = Math.max(a, b);
          // Card extends below or above: lo-1 or hi+1
          if (cardOrd === lo - 1 || cardOrd === hi + 1) return true;
          // Circular wrap (e.g., Q-K-A or A-2-3)
          if (cardOrd === (lo - 1 + 13) % 13 || cardOrd === (hi + 1) % 13) return true;
        }
        // Also check circular adjacency (e.g., K(12) and A(0) are adjacent)
        if (diff === 12) {
          // 0 and 12 are circularly adjacent
          if (cardOrd === 1 || cardOrd === 11) return true;
        }
      }
    }
  }

  return false;
}

// ─── Joint Draw and Discard Decision Logic (EV Model) ────────────────────
function evaluateTurnDecision(botHand, visibleCards, botState, nextPlayerModel) {
  const validDiscards = findAllValidDiscards(botHand);
  const currentScore = calculateSum(botHand);
  const remaining = getRemainingDeckDistribution(botState, botHand);

  let sampleSize = Math.min(remaining.length, 30);
  const sampleCards = remaining.length <= 30 ? remaining : remaining.sort(() => Math.random() - 0.5).slice(0, 30);

  let bestVisibleGain = -Infinity;
  let bestVisibleD = null;
  let bestVisibleIndex = 0;
  let visibleCreatesCombo = false;
  let bestDeckGain = -Infinity;
  let bestDeckD = null;

  for (const D of validDiscards) {
    const remainingBase = botHand.filter(hc => !D.some(dc => dc.suit === hc.suit && dc.rank === hc.rank));

    if (visibleCards && visibleCards.length > 0) {
      for (let vi = 0; vi < visibleCards.length; vi++) {
        const vc = visibleCards[vi];
        const handWithVc = [...remainingBase, vc];
        const res = findBestDiscard(handWithVc, botState, nextPlayerModel);
        if (res && res.discard) {
          const gain = currentScore - res.remainingScore;
          const isCombo = res.discard.length > 1 && res.discard.some(c => c.suit === vc.suit && c.rank === vc.rank);
          if (gain > bestVisibleGain || (gain === bestVisibleGain && isCombo && !visibleCreatesCombo)) {
            bestVisibleGain = gain;
            bestVisibleD = D;
            bestVisibleIndex = vi;
            if (isCombo) visibleCreatesCombo = true;
          }
        }
      }
    }

    let deckFutureScore = 0;
    for (const card of sampleCards) {
      const handWithCard = [...remainingBase, card];
      const res = findBestDiscard(handWithCard, botState, nextPlayerModel);
      if (res && res.discard) deckFutureScore += res.remainingScore;
    }
    if (sampleSize > 0) deckFutureScore /= sampleSize;
    const deckGain = currentScore - deckFutureScore;
    if (deckGain > bestDeckGain) {
      bestDeckGain = deckGain;
      bestDeckD = D;
    }
  }

  return { bestVisibleGain, bestVisibleD, bestVisibleIndex, visibleCreatesCombo, bestDeckGain, bestDeckD, sampleSize };
}

// ─── Declaration Logic (Risk-Based + Defensive) ────────────────────────────
function evaluateDeclaration(botHand, botScore, allOpponentModels, botState) {
  const reasoning = [];
  const handSum = calculateSum(botHand);
  reasoning.push(`Bot hand sum: ${handSum}, cumulative score: ${botScore}`);

  // Use the most dangerous (lowest-scoring) opponent for risk calc
  let worstOppMin = Infinity, worstOppMax = 0;
  let anyLooksClose = false;
  for (const model of allOpponentModels) {
    const [oMin, oMax] = model.estimatedScoreRange;
    if (oMin < worstOppMin) worstOppMin = oMin;
    if (oMax > worstOppMax) worstOppMax = oMax;
    if (model.looksCloseToDeclaration) anyLooksClose = true;
  }
  if (worstOppMin === Infinity) { worstOppMin = 5; worstOppMax = 50; }
  reasoning.push(`Lowest opponent estimated range: [${worstOppMin}, ${worstOppMax}]`);

  let probOpponentLower;
  if (worstOppMax <= worstOppMin) {
    probOpponentLower = handSum > worstOppMin ? 1.0 : 0.0;
  } else {
    probOpponentLower = Math.max(0, Math.min(1, (handSum - worstOppMin) / (worstOppMax - worstOppMin)));
  }
  reasoning.push(`P(any opponent < ${handSum}) ≈ ${(probOpponentLower * 100).toFixed(1)}%`);

  const risk = probOpponentLower;
  const threshold = BOT_CONFIG.riskThreshold;

  let aggressionBoost = 0;
  if (handSum <= 5) aggressionBoost = 0.10;
  else if (handSum <= 10) aggressionBoost = 0.05;

  // Defensive boost: if opponent looks close to declaring, be more aggressive
  let defensiveBoost = 0;
  if (anyLooksClose && handSum <= 15) {
    defensiveBoost = 0.15;
    reasoning.push(`⚠️ An opponent looks close to declaring! Adding defensive urgency.`);
  }

  const effectiveThreshold = threshold + aggressionBoost + defensiveBoost + (BOT_CONFIG.aggressionLevel * 0.05);
  reasoning.push(`Risk: ${(risk * 100).toFixed(1)}%, threshold: ${(effectiveThreshold * 100).toFixed(1)}%`);

  const improvementPotential = handSum > 5 ? 'some' : 'negligible';
  const shouldDeclare = risk < effectiveThreshold && (handSum <= 10 || improvementPotential === 'negligible');

  if (shouldDeclare) {
    reasoning.push(`✅ DECLARING — risk ${(risk * 100).toFixed(1)}% < threshold ${(effectiveThreshold * 100).toFixed(1)}%, hand sum ${handSum}`);
  } else {
    reasoning.push(`❌ Not declaring — risk too high or improvement still possible`);
  }

  return { shouldDeclare, reasoning, risk, handSum };
}

// ─── Helper: format card name ───────────────────────────────────────────────
const SUIT_NAMES = { hearts: 'Hearts', diamonds: 'Diamonds', clubs: 'Clubs', spades: 'Spades' };
const SUIT_SYMBOLS = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
function cardName(c) { return `${c.rank}${SUIT_SYMBOLS[c.suit] || c.suit[0].toUpperCase()}`; }
function cardNames(cards) { return cards.map(cardName).join(', '); }

// ─── Main Bot Turn Decision ────────────────────────────────────────────────
function makeBotDecision(gameState, botPlayerIndex) {
  const botPlayer = gameState.players[botPlayerIndex];
  const botHand = [...botPlayer.hand];
  const visibleCards = gameState.visibleCard || [];

  if (!botPlayer.botState) {
    botPlayer.botState = createBotState();
    recordSeenCards(botPlayer.botState, visibleCards);
    recordSeenCards(botPlayer.botState, botHand);
  }

  const botState = botPlayer.botState;
  botState.turnCount++;
  const allOpponentModels = buildAllOpponentModels(botState, gameState, botPlayerIndex);
  const currentScore = calculateSum(botHand);
  const remaining = getRemainingDeckDistribution(botState, botHand);

  const decision = [];
  decision.push(`It's my turn #${botState.turnCount}. My hand is [${cardNames(botHand)}] with a total value of ${currentScore}.`);
  decision.push(`I've tracked ${botState.seenCards.length} cards so far — ${remaining.length} cards remain unseen in the deck.`);

  // Summarize per-opponent insights
  for (const model of allOpponentModels) {
    const oppName = gameState.players[model.playerIndex]?.username || `Player ${model.playerIndex + 1}`;
    let insight = `I estimate ${oppName}'s score is between ${model.estimatedScoreRange[0]} and ${model.estimatedScoreRange[1]} (~${model.estimatedHandSize} cards)`;
    if (model.looksCloseToDeclaration) insight += ' ⚠️ (looks close to declaring!)';
    if (model.estimatedHandSize < 5 && model.preferredSuits.length > 0) {
      insight += `. With <5 cards, same-suit combos are impossible — I won't worry about their suit preferences.`;
    }
    decision.push(insight + '.');
  }

  // Declaration check
  const declareEval = evaluateDeclaration(botHand, botPlayer.score, allOpponentModels, botState);
  const riskPct = (declareEval.risk * 100).toFixed(1);

  if (declareEval.shouldDeclare) {
    decision.push(`My hand sum is only ${declareEval.handSum}. There's just a ${riskPct}% chance an opponent beats me. I'm declaring!`);
    return { action: 'declare', decisionReasoning: decision };
  }

  decision.push(`I considered declaring (hand sum = ${declareEval.handSum}), but the risk is ${riskPct}% — too risky. I'll keep playing.`);

  // Find the next active (non-eliminated) player after the bot
  let nextActiveIndex = -1;
  for (let offset = 1; offset < gameState.players.length; offset++) {
    const idx = (botPlayerIndex + offset) % gameState.players.length;
    if (!gameState.players[idx].eliminated) { nextActiveIndex = idx; break; }
  }
  const nextPlayerModel = nextActiveIndex >= 0 ? buildOpponentModel(botState, nextActiveIndex) : null;
  const nextPlayerName = nextActiveIndex >= 0 ? (gameState.players[nextActiveIndex]?.username || `Player ${nextActiveIndex + 1}`) : null;

  if (nextPlayerModel && nextPlayerName) {
    decision.push(`The next player is ${nextPlayerName} — I'll only worry about avoiding helpful discards for them.`);
    // Detect adjacent-rank pickup pattern for reasoning display
    const nextPickups = nextPlayerModel.pickedUpCards;
    if (nextPickups.length >= 2) {
      for (let i = 0; i < nextPickups.length; i++) {
        for (let j = i + 1; j < nextPickups.length; j++) {
          const diff = Math.abs(RANK_ORDER[nextPickups[i].rank] - RANK_ORDER[nextPickups[j].rank]);
          if (diff === 1 || diff === 12) {
            decision.push(`⚠️ ${nextPlayerName} picked up ${cardName(nextPickups[i])} and ${cardName(nextPickups[j])} — adjacent ranks! I'll avoid discarding cards that complete their sequence.`);
            i = nextPickups.length; // break outer
            break;
          }
        }
      }
    }
  }

  // Joint Turn Decision
  const evalResult = evaluateTurnDecision(botHand, visibleCards, botState, nextPlayerModel);
  let drawFrom = 'deck';
  let visibleIndex = 0;
  let discardCards = evalResult.bestDeckD || [botHand[0]];

  if (visibleCards.length > 0) {
    if (evalResult.visibleCreatesCombo) {
      drawFrom = 'visible';
      visibleIndex = evalResult.bestVisibleIndex;
      discardCards = evalResult.bestVisibleD || discardCards;
      decision.push(`I see that picking up ${cardName(visibleCards[visibleIndex])} creates a combination. I will discard [${cardNames(discardCards)}] and draw it!`);
    } else if (evalResult.bestVisibleGain > evalResult.bestDeckGain && evalResult.bestVisibleGain > 0) {
      drawFrom = 'visible';
      visibleIndex = evalResult.bestVisibleIndex;
      discardCards = evalResult.bestVisibleD || discardCards;
      decision.push(`By discarding [${cardNames(discardCards)}] and taking ${cardName(visibleCards[visibleIndex])}, my expected gain is ${evalResult.bestVisibleGain.toFixed(1)}, better than the deck's ${evalResult.bestDeckGain.toFixed(1)}.`);
    } else {
      decision.push(`Visible card isn't worth taking (expected gain ${evalResult.bestDeckGain.toFixed(1)} from deck). I'll discard [${cardNames(discardCards)}] and draw blindly.`);
    }
  } else {
    decision.push(`No visible cards available. I'll discard [${cardNames(discardCards)}] and draw from the hidden deck.`);
  }

  if (drawFrom === 'visible') {
    recordSeenCards(botState, [visibleCards[visibleIndex]]);
  }

  return {
    action: 'turn',
    drawFrom,
    visibleIndex: drawFrom === 'visible' ? visibleIndex : undefined,
    discardCards,
    decisionReasoning: decision,
  };
}

// ─── Play Along hint (hard-bot turn logic, no declare suggestion) ───────────
function makePlayAlongHint(gameState, playerIndex, hintState) {
  const player = gameState.players[playerIndex];
  const hand = [...player.hand];
  const visibleCards = gameState.visibleCard || [];

  if (!hintState) hintState = createBotState();
  recordSeenCards(hintState, visibleCards);
  recordSeenCards(hintState, hand);

  const currentScore = calculateSum(hand);
  const remaining = getRemainingDeckDistribution(hintState, hand);
  const reasoning = [];
  reasoning.push(`Your hand is [${cardNames(hand)}] with total value ${currentScore}.`);
  reasoning.push(`You've tracked ${hintState.seenCards.length} seen cards — about ${remaining.length} cards may still be in the hidden deck.`);

  let nextActiveIndex = -1;
  for (let offset = 1; offset < gameState.players.length; offset++) {
    const idx = (playerIndex + offset) % gameState.players.length;
    if (!gameState.players[idx].eliminated) {
      nextActiveIndex = idx;
      break;
    }
  }
  const nextPlayerModel = nextActiveIndex >= 0 ? buildOpponentModel(hintState, nextActiveIndex) : null;
  const nextPlayerName = nextActiveIndex >= 0
    ? (gameState.players[nextActiveIndex]?.username || `Player ${nextActiveIndex + 1}`)
    : null;

  if (nextPlayerModel && nextPlayerName) {
    reasoning.push(`Next turn goes to ${nextPlayerName} — we avoid discards that would help them on the visible pile.`);
    const oppPlayer = nextActiveIndex >= 0 ? gameState.players[nextActiveIndex] : null;
    const lastDraw = oppPlayer?.lastDrawnCard;
    const lastFrom = oppPlayer?.lastDrawnFrom;
    if (lastFrom === 'visible' && lastDraw && !lastDraw.hidden) {
      const priorPickups = nextPlayerModel.pickedUpCards.filter(
        (c) => !(c.suit === lastDraw.suit && c.rank === lastDraw.rank)
      );
      const prevPickup = priorPickups.length > 0 ? priorPickups[priorPickups.length - 1] : null;
      if (prevPickup) {
        const diff = Math.abs(RANK_ORDER[lastDraw.rank] - RANK_ORDER[prevPickup.rank]);
        if (diff === 1 || diff === 12) {
          reasoning.push(
            `⚠️ ${nextPlayerName} recently took ${cardName(lastDraw)} from the visible pile after ${cardName(prevPickup)} — adjacent ranks. Avoid discarding cards that complete their sequence.`
          );
        }
      }
    } else if (lastFrom === 'deck' || lastDraw?.hidden) {
      reasoning.push(`${nextPlayerName}'s last draw was from the hidden deck.`);
    }
  }

  const evalResult = evaluateTurnDecision(hand, visibleCards, hintState, nextPlayerModel);
  let drawFrom = 'deck';
  let visibleIndex = 0;
  let discardCards = evalResult.bestDeckD || [hand[0]];

  if (visibleCards.length > 0) {
    if (evalResult.visibleCreatesCombo) {
      drawFrom = 'visible';
      visibleIndex = evalResult.bestVisibleIndex;
      discardCards = evalResult.bestVisibleD || discardCards;
      reasoning.push(
        `Taking ${cardName(visibleCards[visibleIndex])} from the visible pile completes a combination after discarding [${cardNames(discardCards)}].`
      );
    } else if (evalResult.bestVisibleGain > evalResult.bestDeckGain && evalResult.bestVisibleGain > 0) {
      drawFrom = 'visible';
      visibleIndex = evalResult.bestVisibleIndex;
      discardCards = evalResult.bestVisibleD || discardCards;
      reasoning.push(
        `Discarding [${cardNames(discardCards)}] and drawing ${cardName(visibleCards[visibleIndex])} has expected gain ${evalResult.bestVisibleGain.toFixed(1)}, better than the hidden deck (${evalResult.bestDeckGain.toFixed(1)}).`
      );
    } else {
      reasoning.push(
        `Visible cards are not worth taking (hidden deck expected gain ${evalResult.bestDeckGain.toFixed(1)}). Discard [${cardNames(discardCards)}] and draw from the hidden deck.`
      );
    }
  } else {
    reasoning.push(`No visible cards on the pile. Discard [${cardNames(discardCards)}] and draw from the hidden deck.`);
  }

  if (drawFrom === 'visible') {
    recordSeenCards(hintState, [visibleCards[visibleIndex]]);
  }

  reasoning.push(
    `We sampled ${evalResult.sampleSize} possible hidden cards to estimate deck value — same approach as the hard bot.`
  );

  return {
    drawFrom,
    visibleIndex: drawFrom === 'visible' ? visibleIndex : undefined,
    discardCards,
    reasoning,
    hintState,
  };
}

function observeHintState(hintState, gameState, actingPlayerIndex, previousVisibleCards, observerPlayerIndex) {
  if (!hintState || actingPlayerIndex === observerPlayerIndex) return;
  const currentVisible = gameState.visibleCard || [];
  const actingPlayer = gameState.players[actingPlayerIndex];

  recordSeenCards(hintState, currentVisible);

  if (currentVisible.length > 0) {
    recordOpponentDiscard(hintState, currentVisible, actingPlayerIndex);
  }

  const drawnFrom = actingPlayer?.lastDrawnFrom;
  const drawnCard = actingPlayer?.lastDrawnCard;

  // Prefer authoritative turn metadata (set by processTurn on the server).
  // Do not infer pickups by diffing the old visible pile — those cards usually
  // moved to exposed (or were reshuffled into the deck), not into the opponent's hand.
  if (drawnFrom === 'deck' || drawnCard?.hidden === true) {
    recordOpponentDeckDraw(hintState, actingPlayerIndex);
    return;
  }

  if (drawnFrom === 'visible' && drawnCard && !drawnCard.hidden) {
    recordOpponentPickup(hintState, { suit: drawnCard.suit, rank: drawnCard.rank }, actingPlayerIndex);
    return;
  }

  // Fallback when draw metadata is missing: allow at most one inferred visible pickup.
  let inferredPickup = null;
  if (previousVisibleCards && previousVisibleCards.length > 0) {
    for (const prevCard of previousVisibleCards) {
      const stillVisible = currentVisible.some(
        (c) => c.suit === prevCard.suit && c.rank === prevCard.rank
      );
      const inExposed = (gameState.exposedCards || []).some(
        (c) => c.suit === prevCard.suit && c.rank === prevCard.rank
      );
      if (!stillVisible && !inExposed) {
        if (!inferredPickup) {
          inferredPickup = prevCard;
        }
        break;
      }
    }
  }

  if (inferredPickup) {
    recordOpponentPickup(hintState, inferredPickup, actingPlayerIndex);
  } else {
    recordOpponentDeckDraw(hintState, actingPlayerIndex);
  }
}

// ─── Observation: Track all players' moves ─────────────────────────────────
function observePlayerMove(gameState, actingPlayerIndex, previousVisibleCards) {
  const currentVisible = gameState.visibleCard || [];
  const actingPlayer = gameState.players[actingPlayerIndex];
  const actingName = actingPlayer.username;

  // Update all hard bots (any index)
  for (let botIndex = 0; botIndex < gameState.players.length; botIndex++) {
    if (botIndex === actingPlayerIndex) continue;
    const botPlayer = gameState.players[botIndex];
    if (!botPlayer || !botPlayer.isBot || botPlayer.difficulty !== 'hard') continue;
    if (!botPlayer.botState) {
      botPlayer.botState = createBotState();
      recordSeenCards(botPlayer.botState, currentVisible);
      recordSeenCards(botPlayer.botState, botPlayer.hand);
    }
    const botState = botPlayer.botState;
    const obs = [];

    // Detect discards
    if (currentVisible.length > 0) {
      recordOpponentDiscard(botState, currentVisible, actingPlayerIndex);
      obs.push(`${actingName} discarded [${cardNames(currentVisible)}] onto the visible pile.`);
    }

    // Detect if they picked up a visible card
    let pickedUp = null;
    if (previousVisibleCards && previousVisibleCards.length > 0) {
      for (const prevCard of previousVisibleCards) {
        const stillVisible = currentVisible.some(c => c.suit === prevCard.suit && c.rank === prevCard.rank);
        const inExposed = (gameState.exposedCards || []).some(c => c.suit === prevCard.suit && c.rank === prevCard.rank);
        if (!stillVisible && !inExposed) {
          recordOpponentPickup(botState, prevCard, actingPlayerIndex);
          pickedUp = prevCard;
        }
      }
    }

    if (pickedUp) {
      obs.push(`I noticed ${actingName} picked up ${cardName(pickedUp)} from the visible pile — they specifically chose that card.`);
      obs.push(`This tells me they likely need ${pickedUp.rank}s or ${SUIT_NAMES[pickedUp.suit]} cards. I'll avoid discarding similar cards.`);
      // Check for adjacent-rank sequence pattern in this opponent's pickups
      const oppData = getOpponentData(botState, actingPlayerIndex);
      if (oppData.pickups.length >= 2) {
        const latest = RANK_ORDER[pickedUp.rank];
        for (const prev of oppData.pickups) {
          if (prev.suit === pickedUp.suit && prev.rank === pickedUp.rank) continue;
          const prevOrd = RANK_ORDER[prev.rank];
          const diff = Math.abs(latest - prevOrd);
          if (diff === 1 || diff === 12) {
            obs.push(`⚠️ ${actingName} has now picked up ${cardName(prev)} and ${cardName(pickedUp)} — adjacent ranks! They may be building a sequence. I'll avoid discarding cards that complete it.`);
            break;
          }
        }
      }
    } else {
      recordOpponentDeckDraw(botState, actingPlayerIndex);
      obs.push(`${actingName} drew from the deck (blind draw).`);
    }

    // Per-opponent summary
    const allModels = buildAllOpponentModels(botState, gameState, botIndex);
    for (const model of allModels) {
      const oppData = getOpponentData(botState, model.playerIndex);
      const totalDiscards = oppData.discards.length;
      if (totalDiscards > 0) {
        const avgVal = (oppData.discards.reduce((s, c) => s + RANK_VALUES[c.rank], 0) / totalDiscards).toFixed(1);
        const oppName = gameState.players[model.playerIndex]?.username || `Player ${model.playerIndex + 1}`;
        if (parseFloat(avgVal) >= 8) {
          obs.push(`${oppName} is discarding high-value cards — estimated score: ${model.estimatedScoreRange[0]}–${model.estimatedScoreRange[1]}.`);
        } else if (parseFloat(avgVal) <= 4) {
          obs.push(`${oppName} is discarding low-value cards — may be holding high cards for sequences. Score: ${model.estimatedScoreRange[0]}–${model.estimatedScoreRange[1]}.`);
        }
      }
      if (model.avoidedSuits.length > 0) {
        obs.push(`They seem to avoid ${model.avoidedSuits.map(s => SUIT_NAMES[s]).join(' and ')}.`);
      }
      if (model.preferredSuits.length > 0) {
        if (model.estimatedHandSize >= 5) {
          obs.push(`They seem to prefer ${model.preferredSuits.map(s => SUIT_NAMES[s]).join(' and ')} — I'll avoid discarding those suits (they could build a 5-card same-suit combo).`);
        } else {
          obs.push(`They seem to prefer ${model.preferredSuits.map(s => SUIT_NAMES[s]).join(' and ')}, but with ~${model.estimatedHandSize} cards in hand, a same-suit combo is impossible — no need to avoid those suits.`);
        }
      }
    }

    recordSeenCards(botState, currentVisible);
    botState.pendingObservations.push(...obs);
  }
}

module.exports = {
  createBotState,
  makeBotDecision,
  makePlayAlongHint,
  observeHintState,
  observePlayerMove,
  recordSeenCards,
  recordDiscard,
  BOT_CONFIG,
};
