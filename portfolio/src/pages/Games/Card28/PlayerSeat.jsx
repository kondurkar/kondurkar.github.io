// src/pages/Games/Card28/PlayerSeat.jsx
import PlayingCard from "./Card";

export default function PlayerSeat({ player, position, isCurrentTurn, isDealer, isTrumpCaller, cardCount }) {
  const POS_CLS = {
    top:   "flex-col items-center",
    left:  "flex-row items-center",
    right: "flex-row-reverse items-center",
  };

  return (
    <div className={`flex gap-2 ${POS_CLS[position]}`}>
      <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all duration-200
                       ${isCurrentTurn
                         ? "border-cyan-400 bg-cyan-400/10 shadow-[0_0_16px_rgba(0,200,255,0.3)]"
                         : "border-cyan-500/10 bg-[#141c26]"
                       }`}>
        <div className="flex items-center gap-1.5">
          <span className="text-base">{player.isBot ? "🤖" : "🧑"}</span>
          <span className="font-mono text-[11px] text-slate-300">{player.name}</span>
        </div>
        <div className="flex gap-1">
          {isDealer && (
            <span className="font-mono text-[8px] text-amber-400 bg-amber-400/10
                             border border-amber-400/30 px-1.5 py-0.5 rounded-sm">D</span>
          )}
          {isTrumpCaller && (
            <span className="font-mono text-[8px] text-cyan-400 bg-cyan-400/10
                             border border-cyan-400/30 px-1.5 py-0.5 rounded-sm">★</span>
          )}
        </div>
      </div>

      {/* Mini hand fan (face down) */}
      {position === "top" && (
        <div className="flex -space-x-4">
          {Array.from({ length: Math.min(cardCount, 8) }, (_, i) => (
            <PlayingCard key={i} faceDown small />
          ))}
        </div>
      )}
    </div>
  );
}
