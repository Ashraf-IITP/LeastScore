// lib/bot.js - Hard Difficulty AI Bot for LeastScore card game
// Implements: card memory, hand optimization, EV-based draw decisions,
// per-opponent modeling, sequence-aware discards, defensive declaration.
//
// Improvements applied:
//   #2  — Bayesian declaration confidence with data-driven tighter bounds
//   #3  — Combo pre-detection as a guaranteed floor before draw evaluation
//   #4  — End-game exhaustive enumeration (≤10 unseen cards) + declaration pressure boost
//   #5  — Exact opponent hand-size tracking via draw/discard accounting
//   #6  — Continuous per-event Bayesian score-range updates (replaces coarse step buckets)
//   #10 — Hand variance penalty: prefer lower-variance hands when score is competitive
//   #11 — Reshuffled deck reconstruction from seenCards + discardHistory

const { SUITS, RANKS, RANK_VALUES, RANK_ORDER } = require('./types');
const { calculateSum, isSequence } = require('./hand');

// ─── Difficulty Calibration Parameters ──────────────────────────────────────
const BOT_CONFIG = {
  riskThreshold: 0.20,       // 20% — declare if risk of losing < this
  memoryAccuracy: 1.0,       // 100% for hard bot
  aggressionLevel: 0.6,      // 0-1 scale, higher = more willing to declare early
  endGameDeckSize: 10,       // #4: switch to exhaustive enumeration below this
  variancePenaltyWeight: 0.3, // #10: how much to penalise high-variance hands
};

// ─── Bot State Factory ──────────────────────────────────────────────────────
function createBotState() {
  return {
    seenCards: [],           // All revealed cards (drawn + discarded)
    discardHistory: [],      // Ordered list of { card, byPlayer }
    perOpponent: {},         // { [playerIndex]: { pickups: [], discards: [], deckDraws: 0, exactHandSize: 5 } }
    turnCount: 0,
    deckExhausted: false,    // #11: flag set when deck runs out and pile is reshuffled
    reshuffleSeenSnapshot: [], // #11: snapshot of seenCards at reshuffle time
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
    // #5: exactHandSize starts at 5 (game start)
    botState.perOpponent[playerIndex] = {
      pickups: [],
      discards: [],
      deckDraws: 0,
      exactHandSize: 5,
    };
  }
  return botState.perOpponent[playerIndex];
}

function recordOpponentPickup(botState, card, byPlayer) {
  const opp = getOpponentData(botState, byPlayer);
  opp.pickups.push({ ...card });
  // #5: pickup adds 1 card to hand
  opp.exactHandSize = Math.max(1, opp.exactHandSize + 1);
  recordSeenCards(botState, [card]);
}

function recordOpponentDiscard(botState, cards, byPlayer) {
  const opp = getOpponentData(botState, byPlayer);
  for (const card of cards) {
    opp.discards.push({ ...card });
  }
  // #5: discard removes N cards from hand
  opp.exactHandSize = Math.max(1, opp.exactHandSize - cards.length);
  recordSeenCards(botState, cards);
}

function recordOpponentDeckDraw(botState, byPlayer) {
  const opp = getOpponentData(botState, byPlayer);
  opp.deckDraws++;
  // #5: deck draw adds 1 card to hand
  opp.exactHandSize = Math.max(1, opp.exactHandSize + 1);
}

// ─── #11: Deck distribution, reshuffle-aware ────────────────────────────────
function getRemainingDeckDistribution(botState, botHand) {
  const fullDeck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      fullDeck.push({ suit, rank });
    }
  }

  // #11: After a reshuffle the "new hidden deck" is reconstructed from the
  // cards the bot has seen that were in the discard/exposed pile at reshuffle time.
  // We exclude: botHand, currently visible cards (already outside deck),
  // and cards seen AFTER the reshuffle (already drawn from new deck).
  if (botState.deckExhausted && botState.reshuffleSeenSnapshot.length > 0) {
    // Cards that were in the exposed pile at reshuffle = snapshot minus botHand
    const botHandKeys = new Set(botHand.map(c => `${c.rank}|${c.suit}`));
    const reshuffledCards = botState.reshuffleSeenSnapshot.filter(
      c => !botHandKeys.has(`${c.rank}|${c.suit}`)
    );
    // Cards drawn from the new deck since reshuffle = seenCards not in snapshot
    const snapshotKeys = new Set(botState.reshuffleSeenSnapshot.map(c => `${c.rank}|${c.suit}`));
    const drawnSinceReshuffle = botState.seenCards.filter(
      c => !snapshotKeys.has(`${c.rank}|${c.suit}`)
    );
    const drawnKeys = new Set(drawnSinceReshuffle.map(c => `${c.rank}|${c.suit}`));
    // Remaining = reshuffled cards minus what has already been drawn since reshuffle
    return reshuffledCards.filter(c => !drawnKeys.has(`${c.rank}|${c.suit}`));
  }

  // Normal path: full deck minus everything we've ever seen or are holding
  const knownCards = [...botState.seenCards];
  for (const card of botHand) {
    if (!knownCards.some(c => c.suit === card.suit && c.rank === card.rank)) {
      knownCards.push(card);
    }
  }
  return fullDeck.filter(dc => !knownCards.some(kc => kc.suit === dc.suit && kc.rank === dc.rank));
}

// #11: Call this when the game signals that the deck has been exhausted and reshuffled.
function recordReshuffle(botState) {
  botState.deckExhausted = true;
  // Snapshot the full seen-card list at this moment — these are the cards
  // that were in the exposed pile and are now the new shuffled deck.
  botState.reshuffleSeenSnapshot = botState.discardHistory.map(e => ({ ...e.card }));
}

// ─── Hand Optimization Engine ───────────────────────────────────────────────
function rankOrd(rank) { return RANK_ORDER[rank]; }

function isSequenceGroup(cards) {
  return isSequence(cards);
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

// ─── #10: Hand variance calculation ─────────────────────────────────────────
// Returns the statistical variance of card values in a hand.
// High variance = holding a mix of low and high cards, riskier.
function handVariance(hand) {
  if (hand.length === 0) return 0;
  const values = hand.map(c => RANK_VALUES[c.rank]);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
}

// ─── Sequence Potential Bonus ───────────────────────────────────────────────
function sequencePotentialBonus(remainingHand) {
  let bonus = 0;
  for (let i = 0; i < remainingHand.length; i++) {
    for (let j = i + 1; j < remainingHand.length; j++) {
      const a = rankOrd(remainingHand[i].rank);
      const b = rankOrd(remainingHand[j].rank);
      const diff = Math.abs(a - b);
      if (diff === 1) bonus -= 1.5;
      else if (diff === 12) bonus -= 1.5;
      else if (diff === 2) bonus -= 0.5;
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

    // #10: variance penalty — penalise keeping a high-variance hand
    const varPenalty = handVariance(remainingHand) * BOT_CONFIG.variancePenaltyWeight;

    let opponentBenefit = 0;
    if (nextPlayerModel) {
      for (const card of discard) {
        if (isLikelyUsefulToOpponent(card, nextPlayerModel)) {
          opponentBenefit += RANK_VALUES[card.rank] * 0.2;
        }
      }
    }

    const adjustedScore = remaining + seqBonus + varPenalty + opponentBenefit;
    if (adjustedScore < bestScore) {
      bestScore = adjustedScore;
      bestDiscard = discard;
      bestPenalty = opponentBenefit;
    }
  }

  return { discard: bestDiscard, remainingScore: bestScore - bestPenalty, opponentPenalty: bestPenalty };
}

// ─── Per-Opponent Modeling System ───────────────────────────────────────────

// #6: Continuous Bayesian score-range update.
// Each observed event (discard value, pickup, deck draw) tightens the estimate.
// We maintain a running mean and confidence interval instead of step buckets.
function computeBayesianScoreRange(opp, turns) {
  const discards = opp.discards;
  const pickups = opp.pickups;
  const handSize = opp.exactHandSize; // #5: use exact hand size

  // Prior: uninformed, wide range
  let estMean = 25;
  let estStdDev = 20;
  const observationCount = discards.length + pickups.length;

  if (observationCount === 0) {
    return [Math.max(0, Math.round(estMean - estStdDev)), Math.round(estMean + estStdDev)];
  }

  // Update mean estimate based on discarded card values:
  // High discards → opponent is shedding high cards → hand is getting lower
  if (discards.length > 0) {
    const avgDiscardValue = discards.reduce((s, c) => s + RANK_VALUES[c.rank], 0) / discards.length;
    // Each discard above average (7) tightens toward low score; below → high score
    const discardSignal = (avgDiscardValue - 7) * 1.5; // positive = lower hand expected
    estMean = Math.max(2, estMean - discardSignal * Math.min(1, discards.length / 4));
    // More discards = more confident
    estStdDev *= Math.max(0.4, 1 - discards.length * 0.08);
  }

  // Update based on pickups: picking visible cards signals targeted optimization
  if (pickups.length > 0) {
    const avgPickupValue = pickups.reduce((s, c) => s + RANK_VALUES[c.rank], 0) / pickups.length;
    if (avgPickupValue <= 4) {
      // Picking up low-value cards = hand is improving toward low score
      estMean = Math.max(2, estMean - 3 * Math.min(1, pickups.length / 3));
      estStdDev *= 0.85;
    } else {
      // Picking up mid/high cards = building sequences or pairs → less certain
      estStdDev *= 1.05;
    }
    // Frequent visible pickups = more strategic play = tighter bounds
    const pickupRatio = pickups.length / Math.max(1, opp.deckDraws + pickups.length);
    if (pickupRatio > 0.5) estStdDev *= 0.80;
  }

  // Adjust for exact hand size (#5): fewer cards → lower max possible score
  const maxByHandSize = handSize * 13; // worst case: all Kings
  const minByHandSize = handSize;      // best case: all Aces
  estMean = Math.min(estMean, maxByHandSize * 0.7);

  const lo = Math.max(minByHandSize, Math.round(estMean - estStdDev));
  const hi = Math.min(maxByHandSize, Math.round(estMean + estStdDev));
  return [lo, Math.max(lo, hi)];
}

function buildOpponentModel(botState, playerIndex) {
  const opp = getOpponentData(botState, playerIndex);

  const model = {
    playerIndex,
    discardedRanks: {},
    discardedSuits: {},
    pickedUpCards: [...opp.pickups],
    preferredSuits: [],
    avoidedSuits: [],
    deckDraws: opp.deckDraws,
    estimatedScoreRange: [5, 50],
    looksCloseToDeclaration: false,
    estimatedHandSize: opp.exactHandSize, // #5: exact, not estimated
    observationConfidence: 0,             // #2: 0-1, how reliable our estimate is
  };

  for (const card of opp.discards) {
    model.discardedRanks[card.rank] = (model.discardedRanks[card.rank] || 0) + 1;
    model.discardedSuits[card.suit] = (model.discardedSuits[card.suit] || 0) + 1;
  }

  const pickupSuitCount = {};
  for (const card of opp.pickups) pickupSuitCount[card.suit] = (pickupSuitCount[card.suit] || 0) + 1;

  const discardSuitCount = {};
  for (const card of opp.discards) discardSuitCount[card.suit] = (discardSuitCount[card.suit] || 0) + 1;

  const sortedDiscardSuits = Object.entries(discardSuitCount).sort((a, b) => b[1] - a[1]);
  if (sortedDiscardSuits.length > 0) model.avoidedSuits = sortedDiscardSuits.slice(0, 2).map(e => e[0]);

  const sortedPickupSuits = Object.entries(pickupSuitCount).sort((a, b) => b[1] - a[1]);
  if (sortedPickupSuits.length > 0) model.preferredSuits = sortedPickupSuits.map(e => e[0]);

  // #6: Use continuous Bayesian update instead of step-function buckets
  model.estimatedScoreRange = computeBayesianScoreRange(opp, botState.turnCount);

  // #2: Observation confidence — how much data backs this estimate
  const observationCount = opp.discards.length + opp.pickups.length;
  // Confidence grows with observations, saturates around 6+ events
  model.observationConfidence = Math.min(1.0, observationCount / 6);

  // Declaration threat: use confident estimate only when confidence is sufficient
  const avgDiscardValue = opp.discards.length > 0
    ? opp.discards.reduce((s, c) => s + RANK_VALUES[c.rank], 0) / opp.discards.length
    : 7;
  const turns = botState.turnCount;

  if (turns >= 3 && avgDiscardValue >= 8 && opp.pickups.length >= 2) {
    model.looksCloseToDeclaration = true;
  }
  if (turns >= 5 && avgDiscardValue >= 7) {
    model.looksCloseToDeclaration = true;
  }
  // High confidence + low estimated score = very likely close to declaring
  if (model.observationConfidence >= 0.7 && model.estimatedScoreRange[1] <= 12) {
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
  if (opponentModel.estimatedHandSize >= 5 && opponentModel.preferredSuits.includes(card.suit)) return true;
  if (opponentModel.pickedUpCards.some(pc => pc.rank === card.rank)) return true;
  if (RANK_VALUES[card.rank] <= 3) return true;

  const pickups = opponentModel.pickedUpCards;
  if (pickups.length >= 2) {
    const cardOrd = RANK_ORDER[card.rank];
    for (let i = 0; i < pickups.length; i++) {
      for (let j = i + 1; j < pickups.length; j++) {
        const a = RANK_ORDER[pickups[i].rank];
        const b = RANK_ORDER[pickups[j].rank];
        const diff = Math.abs(a - b);
        if (diff === 1) {
          const lo = Math.min(a, b);
          const hi = Math.max(a, b);
          if (cardOrd === lo - 1 || cardOrd === hi + 1) return true;
        } else if (diff === 12) {
          if (cardOrd === 1) return true;
        }
      }
    }
  }

  return false;
}

// ─── #3: Combo Pre-Detection ─────────────────────────────────────────────────
// Finds the best immediate multi-card combo already in hand (no draw needed).
// Returns { combo, scoreAfter } or null if only single-card discards exist.
function findBestImmediateCombo(hand, botState, nextPlayerModel) {
  const combos = findAllValidDiscards(hand).filter(c => c.length > 1);
  if (combos.length === 0) return null;

  let bestCombo = null;
  let bestScore = Infinity;

  for (const combo of combos) {
    const remainingHand = hand.filter(hc => !combo.some(dc => dc.suit === hc.suit && dc.rank === hc.rank));
    const score = calculateSum(remainingHand);
    const seqBonus = sequencePotentialBonus(remainingHand);
    // #10: variance penalty for the post-combo hand
    const varPenalty = handVariance(remainingHand) * BOT_CONFIG.variancePenaltyWeight;
    let opponentBenefit = 0;
    if (nextPlayerModel) {
      for (const card of combo) {
        if (isLikelyUsefulToOpponent(card, nextPlayerModel)) {
          opponentBenefit += RANK_VALUES[card.rank] * 0.2;
        }
      }
    }
    const adjusted = score + seqBonus + varPenalty + opponentBenefit;
    if (adjusted < bestScore) {
      bestScore = adjusted;
      bestCombo = { combo, scoreAfter: score, adjustedScore: adjusted };
    }
  }

  return bestCombo;
}

// ─── Joint Draw and Discard Decision Logic (EV Model) ────────────────────────
function evaluateTurnDecision(botHand, visibleCards, botState, nextPlayerModel) {
  const validDiscards = findAllValidDiscards(botHand);
  const currentScore = calculateSum(botHand);
  const remaining = getRemainingDeckDistribution(botState, botHand);

  // #4: End-game — use exhaustive enumeration when few cards remain
  const isEndGame = remaining.length <= BOT_CONFIG.endGameDeckSize;
  const sampleCards = isEndGame
    ? remaining                                           // exhaustive
    : (remaining.length <= 30
        ? remaining
        : [...remaining].sort(() => Math.random() - 0.5).slice(0, 30));
  const sampleSize = sampleCards.length;

  let bestVisibleGain = -Infinity;
  let bestVisibleD = null;
  let bestVisibleIndex = 0;
  let visibleCreatesCombo = false;
  let bestDeckGain = -Infinity;
  let bestDeckD = null;

  for (const D of validDiscards) {
    const remainingBase = botHand.filter(
      hc => !D.some(dc => dc.suit === hc.suit && dc.rank === hc.rank)
    );

    // FIX (#3 synergy): Credit the immediate discard value as a guaranteed gain
    const immediateScore = calculateSum(remainingBase);
    const immediateGain = currentScore - immediateScore;

    // ── Visible card path ──────────────────────────────────────────────────
    if (visibleCards && visibleCards.length > 0) {
      for (let vi = 0; vi < visibleCards.length; vi++) {
        const vc = visibleCards[vi];
        const handWithVc = [...remainingBase, vc];
        const res = findBestDiscard(handWithVc, botState, nextPlayerModel);
        if (res && res.discard) {
          const futureGain = immediateScore - res.remainingScore;
          const totalGain = immediateGain + futureGain;

          const isCombo = res.discard.length > 1
            && res.discard.some(c => c.suit === vc.suit && c.rank === vc.rank);

          if (totalGain > bestVisibleGain ||
            (totalGain === bestVisibleGain && isCombo && !visibleCreatesCombo)) {
            bestVisibleGain = totalGain;
            bestVisibleD = D;
            bestVisibleIndex = vi;
            if (isCombo) visibleCreatesCombo = true;
          }
        }
      }
    }

    // ── Deck draw path ─────────────────────────────────────────────────────
    if (sampleSize > 0) {
      let deckFutureScore = 0;
      for (const card of sampleCards) {
        const handWithCard = [...remainingBase, card];
        const res = findBestDiscard(handWithCard, botState, nextPlayerModel);
        deckFutureScore += res && res.discard ? res.remainingScore : calculateSum(handWithCard);
      }
      deckFutureScore /= sampleSize;

      const deckFutureGain = immediateScore - deckFutureScore;
      const totalDeckGain = immediateGain + deckFutureGain;

      if (totalDeckGain > bestDeckGain) {
        bestDeckGain = totalDeckGain;
        bestDeckD = D;
      }
    }
  }

  return {
    bestVisibleGain, bestVisibleD, bestVisibleIndex, visibleCreatesCombo,
    bestDeckGain, bestDeckD, sampleSize, isEndGame,
  };
}

// ─── #2: Declaration Logic — Bayesian confidence-weighted risk ─────────────
function evaluateDeclaration(botHand, botScore, allOpponentModels, botState) {
  const reasoning = [];
  const handSum = calculateSum(botHand);
  reasoning.push(`Bot hand sum: ${handSum}, cumulative score: ${botScore}`);

  const remaining = getRemainingDeckDistribution(botState, botHand);
  // #4: End-game flag — fewer remaining cards = fewer improvement opportunities
  const isEndGame = remaining.length <= BOT_CONFIG.endGameDeckSize;

  let worstOppMin = Infinity, worstOppMax = 0;
  let anyLooksClose = false;
  let totalConfidence = 0;

  for (const model of allOpponentModels) {
    const [oMin, oMax] = model.estimatedScoreRange;
    if (oMin < worstOppMin) worstOppMin = oMin;
    if (oMax > worstOppMax) worstOppMax = oMax;
    if (model.looksCloseToDeclaration) anyLooksClose = true;
    totalConfidence += model.observationConfidence;
  }

  if (worstOppMin === Infinity) { worstOppMin = 5; worstOppMax = 50; }
  const avgConfidence = allOpponentModels.length > 0
    ? totalConfidence / allOpponentModels.length
    : 0;

  reasoning.push(`Opponent estimated range: [${worstOppMin}, ${worstOppMax}], confidence: ${(avgConfidence * 100).toFixed(0)}%`);

  // #2: Confidence-weighted probability.
  // When confidence is low (few observations), fall back toward a conservative
  // flat prior (wider uncertainty). When confidence is high, trust the range tightly.
  let probOpponentLower;
  if (worstOppMax <= worstOppMin) {
    probOpponentLower = handSum > worstOppMin ? 1.0 : 0.0;
  } else {
    const rawProb = Math.max(0, Math.min(1,
      (handSum - worstOppMin) / (worstOppMax - worstOppMin)
    ));
    // Low confidence → blend toward 0.5 (maximum uncertainty)
    // High confidence → trust the raw probability
    const conservativePrior = 0.5;
    probOpponentLower = rawProb * avgConfidence + conservativePrior * (1 - avgConfidence);
  }

  reasoning.push(`P(any opponent < ${handSum}) ≈ ${(probOpponentLower * 100).toFixed(1)}% (confidence-adjusted)`);

  const risk = probOpponentLower;
  const threshold = BOT_CONFIG.riskThreshold;

  let aggressionBoost = 0;
  if (handSum <= 5) aggressionBoost = 0.10;
  else if (handSum <= 10) aggressionBoost = 0.05;

  let defensiveBoost = 0;
  if (anyLooksClose && handSum <= 15) {
    defensiveBoost = 0.15;
    reasoning.push(`⚠️ An opponent looks close to declaring — defensive urgency applied.`);
  }

  // #4: End-game boost — if deck is nearly empty, stop waiting for improvement
  let endGameBoost = 0;
  if (isEndGame) {
    endGameBoost = 0.08 * (1 - remaining.length / BOT_CONFIG.endGameDeckSize);
    reasoning.push(`🔚 End-game: only ${remaining.length} cards left in deck — urgency boost +${(endGameBoost * 100).toFixed(1)}%`);
  }

  const effectiveThreshold = threshold + aggressionBoost + defensiveBoost + endGameBoost
    + (BOT_CONFIG.aggressionLevel * 0.05);

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
  decision.push(`I've tracked ${botState.seenCards.length} cards so far — ${remaining.length} cards remain unseen in the deck${remaining.length <= BOT_CONFIG.endGameDeckSize ? ' (END GAME — exhaustive mode)' : ''}.`);

  for (const model of allOpponentModels) {
    const oppName = gameState.players[model.playerIndex]?.username || `Player ${model.playerIndex + 1}`;
    let insight = `I estimate ${oppName}'s score is between ${model.estimatedScoreRange[0]} and ${model.estimatedScoreRange[1]} (~${model.estimatedHandSize} cards, confidence: ${(model.observationConfidence * 100).toFixed(0)}%)`;
    if (model.looksCloseToDeclaration) insight += ' ⚠️ (looks close to declaring!)';
    if (model.estimatedHandSize < 5 && model.preferredSuits.length > 0) {
      insight += `. With <5 cards, same-suit combos are impossible.`;
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

  // Next active player
  let nextActiveIndex = -1;
  for (let offset = 1; offset < gameState.players.length; offset++) {
    const idx = (botPlayerIndex + offset) % gameState.players.length;
    if (!gameState.players[idx].eliminated) { nextActiveIndex = idx; break; }
  }
  const nextPlayerModel = nextActiveIndex >= 0 ? buildOpponentModel(botState, nextActiveIndex) : null;
  const nextPlayerName = nextActiveIndex >= 0
    ? (gameState.players[nextActiveIndex]?.username || `Player ${nextActiveIndex + 1}`)
    : null;

  if (nextPlayerModel && nextPlayerName) {
    decision.push(`The next player is ${nextPlayerName} — I'll avoid discards that help them.`);
    const nextPickups = nextPlayerModel.pickedUpCards;
    if (nextPickups.length >= 2) {
      for (let i = 0; i < nextPickups.length; i++) {
        for (let j = i + 1; j < nextPickups.length; j++) {
          const diff = Math.abs(RANK_ORDER[nextPickups[i].rank] - RANK_ORDER[nextPickups[j].rank]);
          if (diff === 1 || diff === 12) {
            decision.push(`⚠️ ${nextPlayerName} picked up ${cardName(nextPickups[i])} and ${cardName(nextPickups[j])} — adjacent ranks! Avoiding sequence completers.`);
            i = nextPickups.length;
            break;
          }
        }
      }
    }
  }

  // #3: Check for an immediate strong combo FIRST — use as floor for all draw decisions
  const immediateCombo = findBestImmediateCombo(botHand, botState, nextPlayerModel);
  if (immediateCombo) {
    const comboSize = immediateCombo.combo.length;
    const comboGain = currentScore - immediateCombo.scoreAfter;
    decision.push(`#3 Pre-detection: I already hold a ${comboSize}-card combo [${cardNames(immediateCombo.combo)}] worth ${comboGain} points — using as floor.`);
  }

  // Joint turn evaluation
  const evalResult = evaluateTurnDecision(botHand, visibleCards, botState, nextPlayerModel);

  // #3: If the immediate combo gain beats both draw paths, play it and draw from deck
  let drawFrom = 'deck';
  let visibleIndex = 0;
  let discardCards = evalResult.bestDeckD || [botHand[0]];

  if (immediateCombo) {
    // Immediate combo total gain = comboGain + expected deck improvement on remaining hand
    // Compare to best draw-path total gain
    const immGain = currentScore - immediateCombo.scoreAfter;
    // If the combo gain clearly beats the best draw option, prefer it
    if (immGain > evalResult.bestVisibleGain && immGain > evalResult.bestDeckGain) {
      discardCards = immediateCombo.combo;
      drawFrom = 'deck';
      decision.push(`Immediate combo [${cardNames(discardCards)}] gains ${immGain.toFixed(1)} — beats all draw options (visible: ${evalResult.bestVisibleGain.toFixed(1)}, deck: ${evalResult.bestDeckGain.toFixed(1)}). Playing it now and drawing from deck.`);
      recordSeenCards(botState, visibleCards);
      return {
        action: 'turn',
        drawFrom: 'deck',
        discardCards,
        decisionReasoning: decision,
      };
    }
  }

  // Standard draw-path decision
  if (visibleCards.length > 0) {
    if (evalResult.visibleCreatesCombo && evalResult.bestVisibleGain >= (evalResult.bestDeckGain - 1)) {
      drawFrom = 'visible';
      visibleIndex = evalResult.bestVisibleIndex;
      discardCards = evalResult.bestVisibleD || discardCards;
      decision.push(`Picking up ${cardName(visibleCards[visibleIndex])} creates a combination (total gain ${evalResult.bestVisibleGain.toFixed(1)}). Drawing it and discarding [${cardNames(discardCards)}].`);
    } else if (evalResult.bestVisibleGain > evalResult.bestDeckGain && evalResult.bestVisibleGain > 0) {
      drawFrom = 'visible';
      visibleIndex = evalResult.bestVisibleIndex;
      discardCards = evalResult.bestVisibleD || discardCards;
      decision.push(`Discarding [${cardNames(discardCards)}] and taking ${cardName(visibleCards[visibleIndex])} — total gain ${evalResult.bestVisibleGain.toFixed(1)} vs deck ${evalResult.bestDeckGain.toFixed(1)}.`);
    } else {
      decision.push(`Visible card not worth taking (deck gain ${evalResult.bestDeckGain.toFixed(1)} ≥ visible ${evalResult.bestVisibleGain.toFixed(1)}). Discarding [${cardNames(discardCards)}] and drawing blindly${evalResult.isEndGame ? ' (exhaustive mode)' : ''}.`);
    }
  } else {
    decision.push(`No visible cards. Discarding [${cardNames(discardCards)}] and drawing from deck${evalResult.isEndGame ? ' (exhaustive mode)' : ''}.`);
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

// ─── Play Along hint ─────────────────────────────────────────────────────────
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
  reasoning.push(`${hintState.seenCards.length} seen cards — ~${remaining.length} cards may still be in the hidden deck${remaining.length <= BOT_CONFIG.endGameDeckSize ? ' (END GAME)' : ''}.`);

  let nextActiveIndex = -1;
  for (let offset = 1; offset < gameState.players.length; offset++) {
    const idx = (playerIndex + offset) % gameState.players.length;
    if (!gameState.players[idx].eliminated) { nextActiveIndex = idx; break; }
  }
  const nextPlayerModel = nextActiveIndex >= 0 ? buildOpponentModel(hintState, nextActiveIndex) : null;
  const nextPlayerName = nextActiveIndex >= 0
    ? (gameState.players[nextActiveIndex]?.username || `Player ${nextActiveIndex + 1}`)
    : null;

  if (nextPlayerModel && nextPlayerName) {
    reasoning.push(`Next turn goes to ${nextPlayerName} — avoid discards that help them.`);
    const oppPlayer = nextActiveIndex >= 0 ? gameState.players[nextActiveIndex] : null;
    const lastDraw = oppPlayer?.lastDrawnCard;
    const lastFrom = oppPlayer?.lastDrawnFrom;
    if (lastFrom === 'visible' && lastDraw && !lastDraw.hidden) {
      const priorPickups = nextPlayerModel.pickedUpCards.filter(
        c => !(c.suit === lastDraw.suit && c.rank === lastDraw.rank)
      );
      const prevPickup = priorPickups.length > 0 ? priorPickups[priorPickups.length - 1] : null;
      if (prevPickup) {
        const diff = Math.abs(RANK_ORDER[lastDraw.rank] - RANK_ORDER[prevPickup.rank]);
        if (diff === 1 || diff === 12) {
          reasoning.push(`⚠️ ${nextPlayerName} recently took ${cardName(lastDraw)} after ${cardName(prevPickup)} — adjacent ranks. Avoid completing their sequence.`);
        }
      }
    } else if (lastFrom === 'deck' || lastDraw?.hidden) {
      reasoning.push(`${nextPlayerName}'s last draw was from the hidden deck.`);
    }
  }

  // #3: Combo pre-detection for hint
  const immediateCombo = findBestImmediateCombo(hand, hintState, nextPlayerModel);
  if (immediateCombo) {
    const gain = currentScore - immediateCombo.scoreAfter;
    reasoning.push(`You already have a ${immediateCombo.combo.length}-card combo [${cardNames(immediateCombo.combo)}] worth ${gain} points immediately — consider playing it now.`);
  }

  const evalResult = evaluateTurnDecision(hand, visibleCards, hintState, nextPlayerModel);
  let drawFrom = 'deck';
  let visibleIndex = 0;
  let discardCards = evalResult.bestDeckD || [hand[0]];

  // #3: If immediate combo beats draw paths, recommend it
  if (immediateCombo) {
    const immGain = currentScore - immediateCombo.scoreAfter;
    if (immGain > evalResult.bestVisibleGain && immGain > evalResult.bestDeckGain) {
      discardCards = immediateCombo.combo;
      drawFrom = 'deck';
      reasoning.push(`Best play: discard the ${immediateCombo.combo.length}-card combo [${cardNames(discardCards)}] now (gain ${immGain.toFixed(1)}) and draw from the hidden deck.`);
      reasoning.push(`Sampled ${evalResult.sampleSize} possible hidden cards${evalResult.isEndGame ? ' (exhaustive)' : ''}.`);
      return { drawFrom, discardCards, reasoning, hintState };
    }
  }

  if (visibleCards.length > 0) {
    if (evalResult.visibleCreatesCombo && evalResult.bestVisibleGain >= (evalResult.bestDeckGain - 1)) {
      drawFrom = 'visible';
      visibleIndex = evalResult.bestVisibleIndex;
      discardCards = evalResult.bestVisibleD || discardCards;
      reasoning.push(`Taking ${cardName(visibleCards[visibleIndex])} completes a combination after discarding [${cardNames(discardCards)}] (total gain ${evalResult.bestVisibleGain.toFixed(1)}).`);
    } else if (evalResult.bestVisibleGain > evalResult.bestDeckGain && evalResult.bestVisibleGain > 0) {
      drawFrom = 'visible';
      visibleIndex = evalResult.bestVisibleIndex;
      discardCards = evalResult.bestVisibleD || discardCards;
      reasoning.push(`Discard [${cardNames(discardCards)}] and draw ${cardName(visibleCards[visibleIndex])} — gain ${evalResult.bestVisibleGain.toFixed(1)} vs deck ${evalResult.bestDeckGain.toFixed(1)}.`);
    } else {
      reasoning.push(`Visible cards not worth taking (deck gain ${evalResult.bestDeckGain.toFixed(1)}). Discard [${cardNames(discardCards)}] and draw from deck${evalResult.isEndGame ? ' (exhaustive)' : ''}.`);
    }
  } else {
    reasoning.push(`No visible cards. Discard [${cardNames(discardCards)}] and draw from deck${evalResult.isEndGame ? ' (exhaustive)' : ''}.`);
  }

  if (drawFrom === 'visible') recordSeenCards(hintState, [visibleCards[visibleIndex]]);

  reasoning.push(`Sampled ${evalResult.sampleSize} possible hidden cards${evalResult.isEndGame ? ' (exhaustive)' : ''}.`);

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

  if (drawnFrom === 'deck' || drawnCard?.hidden === true) {
    recordOpponentDeckDraw(hintState, actingPlayerIndex);
    return;
  }

  if (drawnFrom === 'visible' && drawnCard && !drawnCard.hidden) {
    recordOpponentPickup(hintState, { suit: drawnCard.suit, rank: drawnCard.rank }, actingPlayerIndex);
    return;
  }

  let inferredPickup = null;
  if (previousVisibleCards && previousVisibleCards.length > 0) {
    for (const prevCard of previousVisibleCards) {
      const stillVisible = currentVisible.some(c => c.suit === prevCard.suit && c.rank === prevCard.rank);
      const inExposed = (gameState.exposedCards || []).some(c => c.suit === prevCard.suit && c.rank === prevCard.rank);
      if (!stillVisible && !inExposed) {
        if (!inferredPickup) inferredPickup = prevCard;
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

    if (currentVisible.length > 0) {
      recordOpponentDiscard(botState, currentVisible, actingPlayerIndex);
      obs.push(`${actingName} discarded [${cardNames(currentVisible)}] onto the visible pile.`);
    }

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
      obs.push(`${actingName} picked up ${cardName(pickedUp)} — they specifically chose that card.`);
      obs.push(`They likely need ${pickedUp.rank}s or ${SUIT_NAMES[pickedUp.suit]} cards.`);
      const oppData = getOpponentData(botState, actingPlayerIndex);
      if (oppData.pickups.length >= 2) {
        const latest = RANK_ORDER[pickedUp.rank];
        for (const prev of oppData.pickups) {
          if (prev.suit === pickedUp.suit && prev.rank === pickedUp.rank) continue;
          const prevOrd = RANK_ORDER[prev.rank];
          const diff = Math.abs(latest - prevOrd);
          if (diff === 1 || diff === 12) {
            obs.push(`⚠️ ${actingName} picked up ${cardName(prev)} and ${cardName(pickedUp)} — adjacent ranks! They may be building a sequence.`);
            break;
          }
        }
      }
    } else {
      recordOpponentDeckDraw(botState, actingPlayerIndex);
      obs.push(`${actingName} drew from the deck (blind draw).`);
    }

    const allModels = buildAllOpponentModels(botState, gameState, botIndex);
    for (const model of allModels) {
      const oppData = getOpponentData(botState, model.playerIndex);
      const totalDiscards = oppData.discards.length;
      if (totalDiscards > 0) {
        const avgVal = (oppData.discards.reduce((s, c) => s + RANK_VALUES[c.rank], 0) / totalDiscards).toFixed(1);
        const oppName = gameState.players[model.playerIndex]?.username || `Player ${model.playerIndex + 1}`;
        const confStr = `(confidence: ${(model.observationConfidence * 100).toFixed(0)}%)`;
        if (parseFloat(avgVal) >= 8) {
          obs.push(`${oppName} discarding high-value cards — est. score: ${model.estimatedScoreRange[0]}–${model.estimatedScoreRange[1]} ${confStr}.`);
        } else if (parseFloat(avgVal) <= 4) {
          obs.push(`${oppName} discarding low-value cards — may hold high cards for sequences. Score: ${model.estimatedScoreRange[0]}–${model.estimatedScoreRange[1]} ${confStr}.`);
        }
      }
      if (model.avoidedSuits.length > 0) {
        obs.push(`They seem to avoid ${model.avoidedSuits.map(s => SUIT_NAMES[s]).join(' and ')}.`);
      }
      if (model.preferredSuits.length > 0) {
        if (model.estimatedHandSize >= 5) {
          obs.push(`They prefer ${model.preferredSuits.map(s => SUIT_NAMES[s]).join(' and ')} — avoid discarding those suits (5-card combo risk).`);
        } else {
          obs.push(`They prefer ${model.preferredSuits.map(s => SUIT_NAMES[s]).join(' and ')}, but ~${model.estimatedHandSize} cards means same-suit combo is impossible.`);
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
  recordReshuffle,   // #11: exported so game server can call it on deck exhaustion
  BOT_CONFIG,
};
