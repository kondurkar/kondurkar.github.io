// src/pages/Games/Card28/scoring.js
export const WIN_PIPS  = 6;
export const LOSE_PIPS = -6;

export function hasPair(hand, trumpSuit) {
  const hasK = hand.some(c => c.suit === trumpSuit && c.rank === "K");
  const hasQ = hand.some(c => c.suit === trumpSuit && c.rank === "Q");
  return hasK && hasQ;
}

export function findPairHolder(biddingTeamHands, defendingTeamHands, trumpSuit) {
  const biddingHasPair   = biddingTeamHands.some(h => hasPair(h, trumpSuit));
  const defendingHasPair = defendingTeamHands.some(h => hasPair(h, trumpSuit));
  if (biddingHasPair)   return "bidding";
  if (defendingHasPair) return "defending";
  return null;
}

export function adjustBidForPair(bidAmount, pairHolder) {
  if (pairHolder === "bidding")   return Math.max(14, bidAmount - 4);
  if (pairHolder === "defending") return bidAmount + 4;
  return bidAmount;
}

export function calculateGamePoints(originalBid, adjustedTarget, pointsWon) {
  const won = pointsWon >= adjustedTarget;
  const isFullHouse = pointsWon === 28;

  let basePoints = originalBid >= 21 ? 2 : 1;
  if (isFullHouse) basePoints = 3;

  if (won) {
    return { won: true, gamePoints: basePoints, isFullHouse, isDoubled: false };
  }

  const halfTarget = adjustedTarget / 2;
  const isDoubled = pointsWon < halfTarget;
  const gamePoints = isDoubled ? basePoints * 2 : basePoints;

  return { won: false, gamePoints, isFullHouse: false, isDoubled };
}

export function applyGamePoints(currentScore, gamePoints, won) {
  return won ? currentScore + gamePoints : currentScore - gamePoints;
}

export function isGameOver(score) {
  return score >= WIN_PIPS || score <= LOSE_PIPS;
}

export function clampScore(score) {
  return Math.max(LOSE_PIPS, Math.min(WIN_PIPS, score));
}

export function scoreToPips(score) {
  const count = Math.abs(score);
  const isRed = score >= 0;
  return Array.from({ length: count }, () => ({ red: isRed }));
}

export function checkCancellation(players, trumpSuit = null) {
  for (const p of players) {
    if (p.hand.length === 8) {
      const zeroPoints = p.hand.every(c => c.points === 0);
      if (zeroPoints) {
        return { cancelled: true, reason: `${p.name}'s hand has zero point cards — redeal` };
      }
    }
  }

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
