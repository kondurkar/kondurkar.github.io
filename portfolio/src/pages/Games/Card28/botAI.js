// src/pages/Games/Card28/botAI.js
// AI decision-making for bot players. Pure functions — given state,
// return a decision. Swappable later for "remote player" decisions
// arriving over network instead of computed locally.

import { getLegalMoves } from "./gameEngine";
import { RANK_ORDER, CARD_POINTS } from "./deck";

// ── Bidding AI ────────────────────────────────────────────────
function estimateHandStrength(hand) {
  let score = 0;
  const suitCounts = {};

  hand.forEach(c => {
    suitCounts[c.suit] = (suitCounts[c.suit] ?? 0) + 1;
    if (c.rank === "J") score += 4;
    else if (c.rank === "9") score += 3;
    else if (c.rank === "A") score += 2;
    else if (c.rank === "10") score += 1.5;
    else score += 0.5;
  });

  const maxSuitCount = Math.max(...Object.values(suitCounts));
  score += maxSuitCount * 1.5;

  return score; // typical range: 4–20
}

export function botDecideBid(state, playerId) {
  const player = state.players[playerId];
  const strength = estimateHandStrength(player.hand);
  const currentAmount = state.currentBid.amount;

  const maxWillingBid = Math.min(28, Math.round(15 + strength * 0.6));

  if (currentAmount >= maxWillingBid || currentAmount >= 28) {
    return { type: "pass" };
  }

  const nextBid = Math.max(16, currentAmount + 1);
  if (nextBid > maxWillingBid) return { type: "pass" };

  return { type: "bid", amount: nextBid };
}

// ── Trump style AI (Open vs Closed) ────────────────────────────
// Closed trump is a bluffing/information-hiding tool — bots favour it
// when their hand is strong-but-not-overwhelming (worth disguising),
// and favour Open when very confident (no need to hide anything) or
// very weak (hiding won't help, and an early failed-bid penalty hurts
// more if the round becomes invalid from a forced redeal risk).
export function botChooseTrumpStyle(state, playerId) {
  const hand = state.players[playerId].hand;
  const strength = estimateHandStrength(hand);
  // Mid-strength hands (12-18) benefit most from concealment.
  if (strength >= 12 && strength <= 18) {
    return Math.random() < 0.6 ? "closed" : "open";
  }
  return Math.random() < 0.25 ? "closed" : "open";
}

// ── Trump suit selection AI ────────────────────────────────────
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

// ── Closed-trump exposure decision ──────────────────────────────
// Called only when the bot CAN'T follow suit and CAN legally call expose.
// Heuristic: call expose if the bot itself holds strong trump cards
// (wants trump to be "live" so its trumps can win), or if it's a
// defender desperate to stop the bidding side (forces transparency).
export function botDecideExpose(state, playerId) {
  const hand = state.players[playerId].hand;
  const trumpSuit = state.trumpSuit;
  const trumpCount = hand.filter(c => c.suit === trumpSuit).length;
  const hasStrongTrump = hand.some(c => c.suit === trumpSuit && (c.rank === "J" || c.rank === "9"));

  // If we hold good trumps, exposing lets us actually use them to win
  if (hasStrongTrump || trumpCount >= 2) return true;

  // Defenders nearing the trick deadline (7-trick rule) are incentivised
  // to force exposure so the round doesn't go invalid without info.
  const tricksHidden = state.tricksPlayedSinceTrumpHidden ?? 0;
  if (tricksHidden >= 5) return Math.random() < 0.7;

  // Otherwise, mostly keep it hidden (discard safely) — exposing with
  // weak trump just helps the opponent see the suit for free.
  return Math.random() < 0.15;
}

// ── Card play AI ──────────────────────────────────────────────
export function botDecideCard(state, playerId) {
  const legal = getLegalMoves(state, playerId);
  if (legal.length === 1) return legal[0];

  const trick = state.currentTrick;
  const trumpSuit = state.trumpSuit;
  const trumpIsLive = state.trumpStyle !== "closed" || state.trumpRevealed;

  // ── Leading the trick ─────────────────────────────────────
  if (trick.length === 0) {
    // getLegalMoves already enforces "bidder can't lead trump unless forced"
    // for closed mode — legal already reflects that constraint.
    const nonTrump = legal.filter(c => c.suit !== trumpSuit);
    const pool = nonTrump.length > 0 ? nonTrump : legal;
    const sorted = [...pool].sort((a, b) => CARD_POINTS[a.rank] - CARD_POINTS[b.rank]);
    return sorted[0];
  }

  // ── Following ──────────────────────────────────────────────
  const leadSuit = state.leadSuit;
  const hasLeadSuit = legal.some(c => c.suit === leadSuit);

  // Closed trump, can't follow suit, trump still hidden, and bot did NOT
  // call expose this turn (handled separately before this is invoked) —
  // any discard here cannot win, so just dump the lowest-value card,
  // it's purely a safe discard.
  if (!hasLeadSuit && state.trumpStyle === "closed" && !state.trumpRevealed) {
    const sorted = [...legal].sort((a, b) => CARD_POINTS[a.rank] - CARD_POINTS[b.rank]);
    return sorted[0];
  }

  const trumpPlays = trumpIsLive ? trick.filter(t => t.card.suit === trumpSuit) : [];
  const relevantPlays = trumpPlays.length > 0 ? trumpPlays : trick.filter(t => t.card.suit === leadSuit);

  let currentWinner = relevantPlays[0];
  for (const play of relevantPlays.slice(1)) {
    const a = RANK_ORDER.indexOf(play.card.rank);
    const b = RANK_ORDER.indexOf(currentWinner.card.rank);
    if (a < b) currentWinner = play;
  }

  const winningCards = legal.filter(c => {
    if (trumpIsLive && c.suit === trumpSuit && currentWinner.card.suit !== trumpSuit) return true;
    if (c.suit === currentWinner.card.suit) {
      return RANK_ORDER.indexOf(c.rank) < RANK_ORDER.indexOf(currentWinner.card.rank);
    }
    return false;
  });

  const pointsInTrick = trick.reduce((s, t) => s + CARD_POINTS[t.card.rank], 0);
  const isLastPlayer  = trick.length === state.playerCount - 1;
  const partnerWinning = state.playerCount === 4 &&
    state.players[currentWinner.playerId].team === state.players[playerId].team;

  if (partnerWinning && isLastPlayer) {
    const sorted = [...legal].sort((a, b) => CARD_POINTS[a.rank] - CARD_POINTS[b.rank]);
    return sorted[0];
  }

  if (winningCards.length > 0) {
    const sorted = [...winningCards].sort((a, b) => CARD_POINTS[a.rank] - CARD_POINTS[b.rank]);
    if (pointsInTrick >= 3) {
      const byRank = [...winningCards].sort((a,b) =>
        RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank));
      return byRank[0];
    }
    return sorted[0];
  }

  const sorted = [...legal].sort((a, b) => CARD_POINTS[a.rank] - CARD_POINTS[b.rank]);
  return sorted[0];
}
