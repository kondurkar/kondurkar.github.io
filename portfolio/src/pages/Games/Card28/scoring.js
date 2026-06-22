// src/pages/Games/Card28/scoring.js
// ─────────────────────────────────────────────────────────────
// Encapsulates all scoring rules for 28:
//   - Pair (K+Q of trump) adjusts the effective bid target by ±4
//   - Game points: 1 normally, 2 for bids of 21+, 3 for full house (28/28)
//   - Doubling: if bidder scores < half their (adjusted) bid, they lose double
//   - Score tracked as "red pips" (positive) / "black pips" (negative)
//   - Game ends at +6 (win) or -6 (loss) for the bidding side's team
// ─────────────────────────────────────────────────────────────

export const WIN_PIPS  = 6;
export const LOSE_PIPS = -6;

// Does a hand contain both K and Q of the given trump suit?
export function hasPair(hand, trumpSuit) {
  const hasK = hand.some(c => c.suit === trumpSuit && c.rank === "K");
  const hasQ = hand.some(c => c.suit === trumpSuit && c.rank === "Q");
  return hasK && hasQ;
}

// Find which side (bidding team or defending team) holds the Pair.
// teamHands: { biddingTeamHands: [hand, hand], defendingTeamHands: [hand, hand] }
// Returns "bidding" | "defending" | null
export function findPairHolder(biddingTeamHands, defendingTeamHands, trumpSuit) {
  const biddingHasPair   = biddingTeamHands.some(h => hasPair(h, trumpSuit));
  const defendingHasPair = defendingTeamHands.some(h => hasPair(h, trumpSuit));
  if (biddingHasPair)   return "bidding";
  if (defendingHasPair) return "defending";
  return null;
}

// Apply Pair adjustment to the bid target.
// Bidding team has pair  → their target DECREASES by 4 (easier for them)
// Defending team has pair → bidder's target INCREASES by 4 (harder for them)
export function adjustBidForPair(bidAmount, pairHolder) {
  if (pairHolder === "bidding")   return Math.max(14, bidAmount - 4);
  if (pairHolder === "defending") return bidAmount + 4;
  return bidAmount;
}

// ── Game point calculation ────────────────────────────────────
// originalBid: the bid as called (16-28), BEFORE pair adjustment
// adjustedTarget: bid after pair adjustment — this is what must be met
// pointsWon: points the bidding side actually collected (0-28)
//
// Returns: { won: bool, gamePoints: number, isFullHouse: bool, isDoubled: bool }
export function calculateGamePoints(originalBid, adjustedTarget, pointsWon) {
  const won = pointsWon >= adjustedTarget;
  const isFullHouse = pointsWon === 28; // bidder's team took everything

  // Base game points: bids of 21+ are worth 2, otherwise 1.
  // Full house (28/28) is worth 3 outright regardless of bid.
  let basePoints = originalBid >= 21 ? 2 : 1;
  if (isFullHouse) basePoints = 3;

  if (won) {
    return { won: true, gamePoints: basePoints, isFullHouse, isDoubled: false };
  }

  // Lost — check for doubling: scored less than HALF of the adjusted target
  const halfTarget = adjustedTarget / 2;
  const isDoubled = pointsWon < halfTarget;
  const gamePoints = isDoubled ? basePoints * 2 : basePoints;

  return { won: false, gamePoints, isFullHouse: false, isDoubled };
}

// ── Pip score helpers ──────────────────────────────────────────
// score: integer, positive = red pips, negative = black pips
export function applyGamePoints(currentScore, gamePoints, won) {
  return won ? currentScore + gamePoints : currentScore - gamePoints;
}

export function isGameOver(score) {
  return score >= WIN_PIPS || score <= LOSE_PIPS;
}

export function clampScore(score) {
  return Math.max(LOSE_PIPS, Math.min(WIN_PIPS, score));
}

// Render score as an array of pip descriptors for UI
// e.g. score = 3  → [{red:true},{red:true},{red:true}]
// e.g. score = -2 → [{red:false},{red:false}]
export function scoreToPips(score) {
  const count = Math.abs(score);
  const isRed = score >= 0;
  return Array.from({ length: count }, () => ({ red: isRed }));
}

// ── Cancellation check (called right after initial 4-card deal,
// and again after all 8 are dealt for the trump check) ─────────
export function checkCancellation(players, trumpSuit = null) {
  // Condition 1: any single player's hand worth 0 points
  for (const p of players) {
    if (p.hand.length === 8) { // only check full hands
      const zeroPoints = p.hand.every(c => c.points === 0);
      if (zeroPoints) {
        return { cancelled: true, reason: `${p.name}'s hand has zero point cards — redeal` };
      }
    }
  }

  // Condition 2: a full team (both members) holds no trump at all
  if (trumpSuit && players.some(p => p.team !== undefined)) {
    const teams = {};
    players.forEach(p => {
      if (!teams[p.team]) teams[p.team] = [];
      teams[p.team].push(p);
    });
    for (const teamPlayers of Object.values(teams)) {
      if (teamPlayers.length === 2) {
        const noTrump = teamPlayers.every(p => !p.hand.some(c => c.suit === trumpSuit));
        if (noTrump) {
          return { cancelled: true, reason: `Team has no trump cards at all — redeal` };
        }
      }
    }
  }

  return { cancelled: false, reason: null };
}