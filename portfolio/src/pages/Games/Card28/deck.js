// src/pages/Games/Card28/deck.js
// 28 is played with a 32-card deck: 7, 8, 9, 10, J, Q, K, A in each suit

export const SUITS = ["♠", "♥", "♦", "♣"];
export const SUIT_NAMES = { "♠": "Spades", "♥": "Hearts", "♦": "Diamonds", "♣": "Clubs" };
// Both black suits render the same dark, crisp colour — no faded/tinted clubs
export const SUIT_COLOR = { "♠": "text-slate-900", "♣": "text-slate-900", "♥": "text-red-600", "♦": "text-red-600" };

// Card points in 28 — J and 9 are the highest value cards (unusual!)
export const CARD_POINTS = { J: 3, 9: 2, A: 1, 10: 1, K: 0, Q: 0, 8: 0, 7: 0 };

// Rank order for trick-winning (within a suit) — J highest, then 9, A, 10, K, Q, 8, 7
export const RANK_ORDER = ["J", "9", "A", "10", "K", "Q", "8", "7"];

const RANKS = ["7", "8", "9", "10", "J", "Q", "K", "A"];

export function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${rank}${suit}`,
        rank,
        suit,
        points: CARD_POINTS[rank],
      });
    }
  }
  return deck;
}

export function shuffle(deck) {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Deal 4 cards to each player first (for bidding), rest are dealt after bid wins
export function dealInitial(deck, numPlayers = 4) {
  const hands = Array.from({ length: numPlayers }, () => []);
  for (let i = 0; i < numPlayers * 4; i++) {
    hands[i % numPlayers].push(deck[i]);
  }
  const remaining = deck.slice(numPlayers * 4);
  return { hands, remaining };
}

export function dealRemaining(remaining, hands, numPlayers = 4) {
  const newHands = hands.map(h => [...h]);
  for (let i = 0; i < remaining.length; i++) {
    newHands[i % numPlayers].push(remaining[i]);
  }
  return newHands;
}

// Sort a hand: by suit, then by rank order (for nice display)
export function sortHand(hand, trumpSuit = null) {
  const suitOrder = trumpSuit
    ? [trumpSuit, ...SUITS.filter(s => s !== trumpSuit)]
    : SUITS;
  return [...hand].sort((a, b) => {
    const sa = suitOrder.indexOf(a.suit);
    const sb = suitOrder.indexOf(b.suit);
    if (sa !== sb) return sa - sb;
    return RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank);
  });
}

// ── Cancellation-condition helpers ───────────────────────────

// Condition 1: a player's full 8-card hand is worth 0 points
// (no J, 9, A, or 10 — i.e. only K/Q/8/7)
export function isZeroPointHand(hand) {
  return hand.every(c => CARD_POINTS[c.rank] === 0);
}

// Condition 2: neither member of a team holds a single trump card
// hands: array of {team, hand}. Checked once trump is known.
export function teamHasNoTrump(hands, trumpSuit) {
  return hands.every(hand => !hand.some(c => c.suit === trumpSuit));
}
