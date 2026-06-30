// src/pages/Games/Card28/deck.js
export const SUITS = ["♠", "♥", "♦", "♣"];
export const SUIT_NAMES = { "♠": "Spades", "♥": "Hearts", "♦": "Diamonds", "♣": "Clubs" };
export const SUIT_COLOR = { "♠": "text-slate-900", "♣": "text-slate-900", "♥": "text-red-600", "♦": "text-red-600" };
export const CARD_POINTS = { J: 3, 9: 2, A: 1, 10: 1, K: 0, Q: 0, 8: 0, 7: 0 };
export const RANK_ORDER = ["J", "9", "A", "10", "K", "Q", "8", "7"];
const RANKS = ["7", "8", "9", "10", "J", "Q", "K", "A"];

export function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ id: `${rank}${suit}`, rank, suit, points: CARD_POINTS[rank] });
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

export function dealInitial(deck, numPlayers = 4) {
  const hands = Array.from({ length: numPlayers }, () => []);
  for (let i = 0; i < numPlayers * 4; i++) {
    hands[i % numPlayers].push(deck[i]);
  }
  return { hands, remaining: deck.slice(numPlayers * 4) };
}

export function dealRemaining(remaining, hands, numPlayers = 4) {
  const newHands = hands.map(h => [...h]);
  for (let i = 0; i < remaining.length; i++) {
    newHands[i % numPlayers].push(remaining[i]);
  }
  return newHands;
}

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

export function isZeroPointHand(hand) {
  return hand.every(c => CARD_POINTS[c.rank] === 0);
}

export function teamHasNoTrump(hands, trumpSuit) {
  return hands.every(hand => !hand.some(c => c.suit === trumpSuit));
}
