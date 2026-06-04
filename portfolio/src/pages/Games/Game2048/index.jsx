// src/pages/Games/Game2048/index.jsx
import { useRef } from "react";
import { use2048 } from "./use2048";
import Grid from "./Grid";

// ── Stat box ────────────────────────────────────────────────
function ScoreBox({ label, value }) {
  return (
    <div className="flex flex-col items-center bg-[#141c26] border border-cyan-500/10
                    rounded-lg px-5 py-3 min-w-[90px]">
      <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase mb-1">
        {label}
      </span>
      <span className="font-display text-[1.4rem] font-extrabold text-cyan-400 tabular-nums leading-none">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

// ── Overlay (won / game over) ────────────────────────────────
function Overlay({ status, onRestart, onContinue }) {
  const isWon = status === "won";
  return (
    <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-5 z-20"
      style={{ background: isWon ? "rgba(0,255,157,0.12)" : "rgba(8,12,16,0.82)",
               backdropFilter: "blur(4px)" }}>
      <div className="text-4xl">{isWon ? "🏆" : "💀"}</div>
      <h2 className="font-display text-[1.8rem] font-extrabold"
        style={{ color: isWon ? "#00ff9d" : "#e4eaf2" }}>
        {isWon ? "You reached 2048!" : "Game Over"}
      </h2>
      <p className="font-mono text-[13px] text-slate-500">
        {isWon ? "Keep going or start fresh" : "No more moves available"}
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button onClick={onRestart}
          className="bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[12px]
                     tracking-widest px-6 py-2.5 rounded-sm transition-all duration-200
                     hover:shadow-[0_0_20px_rgba(0,200,255,0.4)]">
          New Game
        </button>
        {isWon && (
          <button onClick={onContinue}
            className="bg-transparent border border-emerald-400/40 text-emerald-400
                       font-mono text-[12px] tracking-widest px-6 py-2.5 rounded-sm
                       transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-400/10">
            Keep Going →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Arrow button (mobile) ────────────────────────────────────
function ArrowBtn({ label, icon, onClick }) {
  return (
    <button onClick={onClick} aria-label={label}
      className="w-14 h-14 flex items-center justify-center bg-[#141c26]
                 border border-cyan-500/15 rounded-lg text-cyan-400 text-xl
                 active:bg-[#1a2535] transition-colors duration-150
                 hover:border-cyan-500/40 select-none">
      {icon}
    </button>
  );
}

// ── Main ────────────────────────────────────────────────────
export default function Game2048() {
  const { grid, score, best, status, handleMove, restart, continueGame } = use2048();

  // Touch / swipe support
  const touchStart = useRef(null);

  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const absDx = Math.abs(dx), absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 20) return; // too short
    if (absDx > absDy) handleMove(dx > 0 ? "right" : "left");
    else               handleMove(dy > 0 ? "down"  : "up");
    touchStart.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-6 pb-16 select-none">

      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <h1 className="font-display text-[1.4rem] font-extrabold text-slate-100">2048</h1>
        </div>
        <button onClick={restart}
          className="font-mono text-[12px] text-slate-500 border border-cyan-500/15
                     px-4 py-2 rounded-sm hover:border-cyan-400 hover:text-cyan-400
                     transition-all duration-200 tracking-widest">
          ↺ New Game
        </button>
      </div>

      {/* Scores */}
      <div className="flex gap-3">
        <ScoreBox label="Score" value={score} />
        <ScoreBox label="Best"  value={best}  />
      </div>

      {/* How to play */}
      <p className="font-mono text-[11px] text-slate-600 tracking-wide text-center">
        Use <span className="text-cyan-400">arrow keys</span> or swipe to move tiles.
        Merge to reach <span className="text-cyan-400">2048</span>!
      </p>

      {/* Board */}
      <div className="relative w-full max-w-sm"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}>
        <Grid grid={grid} />
        {(status === "won" || status === "over") && (
          <Overlay status={status} onRestart={restart} onContinue={continueGame} />
        )}
      </div>

      {/* Mobile arrow controls */}
      <div className="flex flex-col items-center gap-2 md:hidden">
        <ArrowBtn label="up"    icon="▲" onClick={() => handleMove("up")} />
        <div className="flex gap-2">
          <ArrowBtn label="left"  icon="◀" onClick={() => handleMove("left")}  />
          <ArrowBtn label="down"  icon="▼" onClick={() => handleMove("down")}  />
          <ArrowBtn label="right" icon="▶" onClick={() => handleMove("right")} />
        </div>
        <p className="font-mono text-[10px] text-slate-700 mt-1">tap to move</p>
      </div>

      {/* Tile legend */}
      <div className="w-full max-w-sm bg-[#141c26] border border-cyan-500/10 rounded-lg p-4">
        <p className="font-mono text-[10px] text-slate-600 tracking-widest uppercase mb-3">Tile Legend</p>
        <div className="grid grid-cols-4 gap-2">
          {[2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048].map(v => (
            <div key={v}
              className="flex items-center justify-center rounded text-[11px] font-display font-bold py-1.5
                         bg-[#1a2535] text-slate-400">
              {v}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
