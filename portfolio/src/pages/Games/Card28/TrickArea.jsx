// src/pages/Games/Card28/TrickArea.jsx
import PlayingCard from "./Card";

const SEAT_POSITION = {
  4: { 0: "bottom", 1: "left",   2: "top",  3: "right"  },
  3: { 0: "bottom", 1: "left",   2: "right" },
  2: { 0: "bottom", 1: "top" },
};

const POS_CLASSES = {
  bottom: "absolute bottom-2 left-1/2 -translate-x-1/2",
  top:    "absolute top-2 left-1/2 -translate-x-1/2",
  left:   "absolute left-2 top-1/2 -translate-y-1/2",
  right:  "absolute right-2 top-1/2 -translate-y-1/2",
};

export default function TrickArea({ trick, playerCount, trumpSuit, trumpRevealed }) {
  const seatMap = SEAT_POSITION[playerCount] ?? SEAT_POSITION[4];

  return (
    <div className="relative w-full h-44 sm:h-52 bg-[#0d1117] border border-cyan-500/10
                    rounded-2xl overflow-hidden">
      {/* Center trump indicator */}
      {trumpSuit && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        flex flex-col items-center gap-1 opacity-20 pointer-events-none">
          <span className="text-4xl">{trumpSuit}</span>
          <span className="font-mono text-[9px] text-slate-500 tracking-widest">TRUMP</span>
        </div>
      )}

      {trick.map(({ playerId, card }) => (
        <div key={playerId} className={POS_CLASSES[seatMap[playerId] ?? "bottom"]}>
          <PlayingCard card={card} />
        </div>
      ))}
    </div>
  );
}