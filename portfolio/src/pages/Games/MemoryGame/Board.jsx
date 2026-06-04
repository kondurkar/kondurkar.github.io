// src/pages/Games/MemoryGame/Board.jsx
import Card from "./Card";

export default function Board({ cards, flipped, matched, onCardClick, cols }) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          isFlipped={flipped.includes(card.id)}
          isMatched={matched.includes(card.symbol)}
          onClick={() => onCardClick(card)}
        />
      ))}
    </div>
  );
}
