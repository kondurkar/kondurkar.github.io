// src/pages/Games/Card28/roundCertainty.js
// Detects when the round's outcome is already mathematically locked in,
// so the bidding team (or defenders) can claim/concede early instead of
// playing out tricks that can no longer change the result.

import { CARD_POINTS } from "./deck";

// Sum of points still "in play" — i.e. still held in any player's hand
// (cards not yet won in a completed trick + current trick in progress)
function pointsRemaining(state) {
  let remaining = 0;
  state.players.forEach(p => {
    p.hand.forEach(c => { remaining += CARD_POINTS[c.rank]; });
  });
  state.currentTrick.forEach(t => { remaining += CARD_POINTS[t.card.rank]; });
  return remaining;
}

// Returns: { isCertain: bool, outcome: "won" | "lost" | null, reason: string }
export function checkRoundCertainty(state) {
  if (state.playerCount !== 4) return { isCertain: false, outcome: null, reason: null };

  const callerTeam = state.players[state.trumpCaller]?.team;
  if (callerTeam === undefined) return { isCertain: false, outcome: null, reason: null };

  const target = state.adjustedTarget ?? state.currentBid.amount;
  const callerLivePoints = state.livePoints[callerTeam] ?? 0;
  const remaining = pointsRemaining(state);

  // Already won: caller's current points already meet target
  if (callerLivePoints >= target) {
    return { isCertain: true, outcome: "won", reason: `Already secured ${callerLivePoints}/${target} points` };
  }

  // Already lost: even winning EVERY remaining point can't reach target
  if (callerLivePoints + remaining < target) {
    return { isCertain: true, outcome: "lost", reason: `Cannot reach ${target} even with all remaining points` };
  }

  return { isCertain: false, outcome: null, reason: null };
}
