// src/pages/Games/Card28/botAI.js
// AI decision-making for bot players. Pure functions — given state,
// return a decision. Swappable later for "remote player" decisions
// arriving over network instead of computed locally.

import { getLegalMoves } from "./gameEngine";
import { RANK_ORDER, CARD_POINTS } from "./deck";

// ── Bidding AI ────────────────────────────────────────────────
// Estimate hand strength from the 4 initial cards (before seeing rest)
function estimateHandStrength(hand) {
  let score = 0;
  const suitCounts = {};

  hand.forEach(c => {
    suitCounts[c.suit] = (suitCounts[c.suit] ?? 0) + 1;
    // High-value cards worth more in estimate
    if (c.rank === "J") score += 4;
    else if (c.rank === "9") score += 3;
    else if (c.rank === "A") score += 2;
    else if (c.rank === "10") score += 1.5;
    else score += 0.5;
  });

  // Bonus for having multiple cards in one suit (likely trump potential)
  const maxSuitCount = Math.max(...Object.values(suitCounts));
  score += maxSuitCount * 1.5;

  return score; // typical range: 4–20
}

export function botDecideBid(state, playerId) {
  const player = state.players[playerId];
  const strength = estimateHandStrength(player.hand);
  const currentAmount = state.currentBid.amount;

  // Convert strength to a bid ceiling the bot is willing to go to
  const maxWillingBid = Math.min(28, Math.round(15 + strength * 0.6));

  if (currentAmount >= maxWillingBid || currentAmount >= 28) {
    return { type: "pass" };
  }

  // Bid minimum increment over current
  const nextBid = Math.max(16, currentAmount + 1);
  if (nextBid > maxWillingBid) return { type: "pass" };

  return { type: "bid", amount: nextBid };
}

// ── Trump selection AI ────────────────────────────────────────
// Bot picks the suit it has the most cards in (across full 8 cards after reveal)
export function botPickTrump(hand) {
  const suitCounts = {};
  hand.forEach(c => { suitCounts[c.suit] = (suitCounts[c.suit] ?? 0) + 1; });
  let bestSuit = hand[0].suit;
  let bestCount = 0;
  for (const [suit, count] of Object.entries(suitCounts)) {
    if (count > bestCount) { bestCount = count; bestSuit = suit; }
  }
  return bestSuit;
}

// ── Card play AI ──────────────────────────────────────────────
// Simple heuristic strategy:
// - If leading: play a safe low card, or a high card if confident
// - If following and can win cheaply: do so
// - If can't win: dump lowest-value card (avoid giving away points)
export function botDecideCard(state, playerId) {
  const legal = getLegalMoves(state, playerId);
  if (legal.length === 1) return legal[0];

  const trick = state.currentTrick;
  const trumpSuit = state.trumpSuit;

  // Leading the trick
  if (trick.length === 0) {
    // Lead with a low non-trump card to probe, unless we have a strong suit
    const nonTrump = legal.filter(c => c.suit !== trumpSuit);
    const pool = nonTrump.length > 0 ? nonTrump : legal;
    // Prefer leading with a card that isn't high-value (avoid feeding points early)
    const sorted = [...pool].sort((a, b) => CARD_POINTS[a.rank] - CARD_POINTS[b.rank]);
    return sorted[0];
  }

  // Following — determine current trick winner
  const leadSuit = state.leadSuit;
  const trumpPlays = trick.filter(t => t.card.suit === trumpSuit);
  const relevantPlays = trumpPlays.length > 0 ? trumpPlays : trick.filter(t => t.card.suit === leadSuit);

  let currentWinner = relevantPlays[0];
  for (const play of relevantPlays.slice(1)) {
    const a = RANK_ORDER.indexOf(play.card.rank);
    const b = RANK_ORDER.indexOf(currentWinner.card.rank);
    if (a < b) currentWinner = play;
  }

  // Can we beat the current winner?
  const winningCards = legal.filter(c => {
    if (c.suit === trumpSuit && currentWinner.card.suit !== trumpSuit) return true;
    if (c.suit === currentWinner.card.suit) {
      return RANK_ORDER.indexOf(c.rank) < RANK_ORDER.indexOf(currentWinner.card.rank);
    }
    return false;
  });

  const pointsInTrick = trick.reduce((s, t) => s + CARD_POINTS[t.card.rank], 0);
  const isLastPlayer  = trick.length === state.playerCount - 1;
  const partnerWinning = state.playerCount === 4 &&
    state.players[currentWinner.playerId].team === state.players[playerId].team;

  // If partner is already winning and we're last, don't waste a good card
  if (partnerWinning && isLastPlayer) {
    const sorted = [...legal].sort((a, b) => CARD_POINTS[a.rank] - CARD_POINTS[b.rank]);
    return sorted[0];
  }

  if (winningCards.length > 0) {
    // Win with the cheapest card that still wins (don't overspend high cards)
    const sorted = [...winningCards].sort((a, b) => {
      // Prefer winning with lower-point cards when possible
      return CARD_POINTS[a.rank] - CARD_POINTS[b.rank];
    });
    // But if trick has high points at stake, use our best card
    if (pointsInTrick >= 3) {
      const byRank = [...winningCards].sort((a,b) =>
        RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank));
      return byRank[0];
    }
    return sorted[0];
  }

  // Can't win — dump the lowest value card
  const sorted = [...legal].sort((a, b) => CARD_POINTS[a.rank] - CARD_POINTS[b.rank]);
  return sorted[0];
}
