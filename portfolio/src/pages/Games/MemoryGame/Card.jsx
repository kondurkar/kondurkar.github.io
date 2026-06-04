// src/pages/Games/MemoryGame/Card.jsx

export default function Card({ card, isFlipped, isMatched, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer select-none
                  transition-transform duration-200
                  ${!isFlipped && !isMatched ? "hover:scale-105" : ""}
                  ${isMatched ? "opacity-60 cursor-default" : ""}`}
      style={{ perspective: "600px", aspectRatio: "1" }}
    >
      {/* Inner flip container */}
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped || isMatched ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Back face */}
        <div
          className="absolute inset-0 rounded-lg flex items-center justify-center
                     bg-[#141c26] border border-cyan-500/20
                     hover:border-cyan-500/40"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-2xl opacity-30 select-none">🎮</div>
          {/* Grid pattern */}
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(0,200,255,0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,200,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "12px 12px",
            }}
          />
        </div>

        {/* Front face */}
        <div
          className={`absolute inset-0 rounded-lg flex items-center justify-center text-3xl
                      border transition-all duration-200
                      ${isMatched
                        ? "bg-emerald-400/10 border-emerald-400/30"
                        : "bg-[#1a2535] border-cyan-500/30"
                      }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {card.emoji}
          {isMatched && (
            <div className="absolute inset-0 rounded-lg bg-emerald-400/5 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
}
