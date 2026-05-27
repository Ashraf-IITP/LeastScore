// lib/easyBot.js - Easy Difficulty AI Bot for LeastScore card game
// Implements: basic greedy logic, limited memory, rule-based choices with structured imperfection.

const { SUITS, RANKS, RANK_VALUES } = require('./types');
const { calculateSum, isSequence } = require('./hand');

// ─── Formatting Helpers ─────────────────────────────────────────────────────
const SUIT_SYMBOLS = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
function cardName(c) { return `${c.rank}${SUIT_SYMBOLS[c.suit] || c.suit[0].toUpperCase()}`; }
function cardNames(cards) { return cards.map(cardName).join(', '); }

// ─── Sequence/Group Validation ──────────────────────────────────────────────
function isSequenceGroup(cards) {
  return isSequence(cards);
}

function findAllValidDiscards(hand) {
  const combos = [];

  // 1-card discards (always valid)
  for (let i = 0; i < hand.length; i++) {
    combos.push([hand[i]]);
  }

  // 2-card: same rank
  for (let i = 0; i < hand.length; i++) {
    for (let j = i + 1; j < hand.length; j++) {
      if (hand[i].rank === hand[j].rank) {
        combos.push([hand[i], hand[j]]);
      }
    }
  }

  // 3-card: sequence
  for (let i = 0; i < hand.length; i++) {
    for (let j = i + 1; j < hand.length; j++) {
      for (let k = j + 1; k < hand.length; k++) {
        const trio = [hand[i], hand[j], hand[k]];
        if (isSequenceGroup(trio)) {
          combos.push(trio);
        }
      }
    }
  }

  // 4-card: same rank
  for (let i = 0; i < hand.length; i++) {
    for (let j = i + 1; j < hand.length; j++) {
      for (let k = j + 1; k < hand.length; k++) {
        for (let l = k + 1; l < hand.length; l++) {
          const quad = [hand[i], hand[j], hand[k], hand[l]];
          if (quad.every(c => c.rank === quad[0].rank)) {
            combos.push(quad);
          }
        }
      }
    }
  }

  // 5-card: sequence or same suit
  if (hand.length >= 5) {
    for (let i = 0; i < hand.length; i++) {
      for (let j = i + 1; j < hand.length; j++) {
        for (let k = j + 1; k < hand.length; k++) {
          for (let l = k + 1; l < hand.length; l++) {
            for (let m = l + 1; m < hand.length; m++) {
              const quint = [hand[i], hand[j], hand[k], hand[l], hand[m]];
              if (isSequenceGroup(quint) || quint.every(c => c.suit === quint[0].suit)) {
                combos.push(quint);
              }
            }
          }
        }
      }
    }
  }

  return combos;
}

function chooseBestDiscard(hand) {
  const validDiscards = findAllValidDiscards(hand);
  let bestDiscard = [hand[0]];
  let bestScore = Infinity;
  
  for (const discard of validDiscards) {
    const remaining = hand.filter(
      hc => !discard.some(dc => dc.suit === hc.suit && dc.rank === hc.rank)
    );
    const score = calculateSum(remaining);
    
    if (score < bestScore) {
      bestScore = score;
      bestDiscard = discard;
    } else if (score === bestScore) {
      // Tie-breaker: prefer combo over single card if score is same
      if (discard.length > bestDiscard.length) {
        bestDiscard = discard;
      }
    }
  }
  return { discard: bestDiscard, remainingScore: bestScore };
}

// ─── Easy Bot State ─────────────────────────────────────────────────────────
function createEasyBotState() {
  return {
    recentDiscards: [],      // All discarded cards globally (no cap)
    selfPickedCards: [],     // Cards this bot picked from visible pile
    opponentPickups: [],     // Recent opponent picks (last 5)
    turnCount: 0,
    pendingObservations: [], // Text observations
  };
}

function getEasyRemainingDeckDistribution(botState, botHand) {
  const fullDeck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      fullDeck.push({ suit, rank });
    }
  }
  
  const knownCards = [...botHand, ...botState.recentDiscards];
  const remaining = fullDeck.filter(
    dc => !knownCards.some(kc => kc.suit === dc.suit && kc.rank === dc.rank)
  );
  return remaining;
}

// ─── Bot Decision Engine ────────────────────────────────────────────────────
function makeEasyBotDecision(gameState, botPlayerIndex) {
  const botPlayer = gameState.players[botPlayerIndex];
  const botHand = [...botPlayer.hand];
  const visibleCards = gameState.visibleCard || [];
  
  if (!botPlayer.botState) {
    botPlayer.botState = createEasyBotState();
  }
  
  const botState = botPlayer.botState;
  botState.turnCount++;
  const currentScore = calculateSum(botHand);
  
  const decision = [];
  decision.push(`Turn #${botState.turnCount}. Hand: [${cardNames(botHand)}], Score: ${currentScore}.`);
  
  // ── Declaration Logic ──
  // Declare when hand score is less than 7 (conservative threshold).
  if (currentScore < 7) {
    decision.push(`My score is ${currentScore}, which is less than 7. I'm confident enough to declare!`);
    return { action: 'declare', decisionReasoning: decision };
  } else {
    decision.push(`Score is ${currentScore}, not low enough to declare yet. I'll keep playing to improve my hand.`);
  }

  // ── Deck vs Visible Decision (EV-based with limited memory and lower accuracy) ──
  const validDiscards = findAllValidDiscards(botHand);
  const remaining = getEasyRemainingDeckDistribution(botState, botHand);
  
  let sampleSize = Math.min(remaining.length, 5); // Small sample for structured imperfection
  const sampleCards = [...remaining].sort(() => Math.random() - 0.5).slice(0, sampleSize);

  let bestVisibleGain = -Infinity;
  let bestVisibleD = null;
  let bestVisibleIndex = 0;
  let visibleCreatesCombo = false;

  let bestDeckGain = -Infinity;
  let bestDeckD = null;

  for (const D of validDiscards) {
    const remainingBase = botHand.filter(hc => !D.some(dc => dc.suit === hc.suit && dc.rank === hc.rank));
    
    // Evaluate Visible
    if (visibleCards.length > 0) {
      for (let vi = 0; vi < visibleCards.length; vi++) {
        const vc = visibleCards[vi];
        const handWithVc = [...remainingBase, vc];
        const res = chooseBestDiscard(handWithVc);
        const futureScore = res.remainingScore;
        const gain = currentScore - futureScore;
        
        const isCombo = res.discard.length > 1 && res.discard.some(c => c.suit === vc.suit && c.rank === vc.rank);
        
        if (gain > bestVisibleGain || (gain === bestVisibleGain && isCombo && !visibleCreatesCombo)) {
          bestVisibleGain = gain;
          bestVisibleD = D;
          bestVisibleIndex = vi;
          if (isCombo) visibleCreatesCombo = true;
        }
      }
    }
    
    // Evaluate Deck
    let deckFutureScore = 0;
    for (const card of sampleCards) {
      const handWithCard = [...remainingBase, card];
      deckFutureScore += chooseBestDiscard(handWithCard).remainingScore;
    }
    if (sampleSize > 0) deckFutureScore /= sampleSize;
    
    const deckGain = currentScore - deckFutureScore;
    if (deckGain > bestDeckGain) {
      bestDeckGain = deckGain;
      bestDeckD = D;
    }
  }

  let drawFrom = 'deck';
  let visibleIndex = 0;
  let pickedVisibleCard = null;
  let discardCards = bestDeckD || [botHand[0]];

  // ── Avoid discarding Aces/low cards for no benefit ──
  // If best discard is a single low card (A or 2) and the deck gain is ≤ 0,
  // prefer discarding the highest single card instead.
  if (drawFrom === 'deck' && discardCards.length === 1) {
    const discVal = RANK_VALUES[discardCards[0].rank];
    if (discVal <= 2 && bestDeckGain <= 0) {
      // Find the highest value single card in hand
      let highestCard = botHand[0];
      for (const c of botHand) {
        if (RANK_VALUES[c.rank] > RANK_VALUES[highestCard.rank]) {
          highestCard = c;
        }
      }
      if (RANK_VALUES[highestCard.rank] > discVal) {
        decision.push(`I was going to discard ${cardName(discardCards[0])} (value ${discVal}), but that's too valuable to throw away for no benefit. I'll discard ${cardName(highestCard)} (value ${RANK_VALUES[highestCard.rank]}) instead.`);
        discardCards = [highestCard];
      }
    }
  }

  if (visibleCards.length > 0) {
    if (visibleCreatesCombo) {
      drawFrom = 'visible';
      visibleIndex = bestVisibleIndex;
      discardCards = bestVisibleD || discardCards;
      pickedVisibleCard = visibleCards[visibleIndex];
      decision.push(`I see that picking up ${cardName(pickedVisibleCard)} creates a combination. I will discard [${cardNames(discardCards)}] from my current hand and draw it!`);
    } else if (bestVisibleGain > bestDeckGain && bestVisibleGain > 0) {
      drawFrom = 'visible';
      visibleIndex = bestVisibleIndex;
      discardCards = bestVisibleD || discardCards;
      pickedVisibleCard = visibleCards[visibleIndex];
      decision.push(`By discarding [${cardNames(discardCards)}] and taking the visible ${cardName(pickedVisibleCard)}, my expected gain is ${bestVisibleGain.toFixed(1)}, better than my estimated deck gain of ${bestDeckGain.toFixed(1)}.`);
    } else {
      decision.push(`Visible card is not helpful enough. I'll discard [${cardNames(discardCards)}] and draw from the hidden deck (expected gain: ${bestDeckGain.toFixed(1)}).`);
    }
  } else {
    decision.push(`No visible cards available. I'll discard [${cardNames(discardCards)}] and draw from the hidden deck.`);
  }

  if (drawFrom === 'visible') {
    botState.selfPickedCards.push(pickedVisibleCard);
  }

  return {
    action: 'turn',
    drawFrom,
    visibleIndex: drawFrom === 'visible' ? visibleIndex : undefined,
    discardCards,
    decisionReasoning: decision,
  };
}

// ─── Observation ────────────────────────────────────────────────────────────
function observeEasyBotMove(gameState, actingPlayerIndex, previousVisibleCards) {
  const gs = gameState;
  const currentVisible = gs.visibleCard || [];
  const prevTop = previousVisibleCards && previousVisibleCards.length > 0 
    ? previousVisibleCards[previousVisibleCards.length - 1] : null;
  const newTop = currentVisible.length > 0 
    ? currentVisible[currentVisible.length - 1] : null;

  const actingPlayer = gs.players[actingPlayerIndex];
  const actingName = actingPlayer.username;

  // Update all easy bots (any index, not just > 0)
  for (let i = 0; i < gs.players.length; i++) {
    if (i === actingPlayerIndex) continue;
    const p = gs.players[i];
    if (!p || !p.isBot || p.difficulty !== 'easy') continue;

    if (!p.botState) p.botState = createEasyBotState();
    const st = p.botState;
    
    if (prevTop && (!newTop || prevTop.rank !== newTop.rank || prevTop.suit !== newTop.suit)) {
      if (currentVisible.length < (previousVisibleCards?.length || 0)) {
        st.opponentPickups.push({ ...prevTop });
        if (st.opponentPickups.length > 5) st.opponentPickups.shift();
        st.pendingObservations.push(`I saw ${actingName} pick up the ${cardName(prevTop)}.`);
      }
    }

    if (newTop) {
      st.recentDiscards.push({ ...newTop });
      st.pendingObservations.push(`I noticed ${actingName} discarded ${cardName(newTop)}.`);
    }
  }
}

module.exports = {
  createEasyBotState,
  makeEasyBotDecision,
  observeEasyBotMove,
};
