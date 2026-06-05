// src/pages/Games/PuzzleGame15/Tile.jsx
// Tap-based — works on mobile AND desktop. No drag/drop.

export function FilledTile({ index, value, isSelected, isSolved, onClick }) {
  const correctPosition = index === value - 1;

  return (
    <div
      id={`place-${index + 1}`}
      onClick={onClick}
      className={`
        relative flex items-center justify-center
        w-full aspect-square rounded-lg
        font-display font-extrabold text-xl
        cursor-pointer select-none
        transition-all duration-150
        border
        ${isSolved
          ? "bg-emerald-400/15 border-emerald-400/40 text-emerald-400 shadow-[0_0_12px_rgba(0,255,157,0.2)]"
          : isSelected
          ? "bg-cyan-400/20 border-cyan-400 text-cyan-300 scale-95 shadow-[0_0_16px_rgba(0,200,255,0.4)]"
          : correctPosition
          ? "bg-[#1a2535] border-cyan-500/30 text-cyan-400"
          : "bg-[#141c26] border-cyan-500/10 text-slate-300 hover:border-cyan-500/30 hover:bg-[#1a2535] active:scale-95"
        }
      `}
    >
      {value}
      {/* Subtle glow on selected */}
      {isSelected && (
        <span className="absolute inset-0 rounded-lg animate-pulse bg-cyan-400/10 pointer-events-none" />
      )}
    </div>
  );
}

export function EmptyTile({ index, isTarget, onClick }) {
  return (
    <div
      id={`place-${index + 1}`}
      onClick={onClick}
      className={`
        w-full aspect-square rounded-lg border-2 border-dashed
        transition-all duration-150 cursor-pointer
        ${isTarget
          ? "border-cyan-400/60 bg-cyan-400/8 shadow-[0_0_16px_rgba(0,200,255,0.2)]"
          : "border-cyan-500/10 bg-[#0d1117]/50"
        }
      `}
    />
  );
}
