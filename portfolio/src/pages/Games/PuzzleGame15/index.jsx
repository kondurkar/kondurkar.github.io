// src/pages/Games/PuzzleGame15/index.jsx
// Mobile-friendly: tap a tile then tap empty space (or tap adjacent tile directly)
// Also supports arrow keys on desktop

import { useEffect, useState, useCallback, useRef } from "react";
import shuffleArray from "../../../utils/shuffleFunction";
import Puzzle from "./Puzzle";
import Timer from "./Timer";

// ── Win check ───────────────────────────────────────────────
function checkWin(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] !== i + 1) return false;
  }
  return true;
}

// ── Stat box ────────────────────────────────────────────────
function StatBox({ label, value }) {
  return (
    <div className="flex flex-col items-center bg-[#141c26] border border-cyan-500/10
                    rounded-lg px-5 py-3 min-w-[80px]">
      <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase mb-1">
        {label}
      </span>
      <span className="font-display text-[1.3rem] font-extrabold text-cyan-400 tabular-nums leading-none">
        {value}
      </span>
    </div>
  );
}

// ── Win banner ──────────────────────────────────────────────
function WinBanner({ moves, time, onNewGame }) {
  const mins = String(Math.floor(time / 60)).padStart(2, "0");
  const secs = String(time % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(8,12,16,0.88)", backdropFilter: "blur(8px)" }}>
      <div className="bg-[#0d1117] border border-emerald-400/30 rounded-xl p-8
                      max-w-sm w-full text-center shadow-[0_0_60px_rgba(0,255,157,0.1)]">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-display text-[2rem] font-extrabold text-emerald-400 mb-1">
          Puzzle Solved!
        </h2>
        <p className="font-mono text-[13px] text-slate-500 mb-8">
          All tiles in the correct order
        </p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-[#141c26] border border-cyan-500/10 rounded-lg p-4">
            <div className="font-display text-[1.6rem] font-extrabold text-cyan-400">{moves}</div>
            <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mt-1">Moves</div>
          </div>
          <div className="bg-[#141c26] border border-cyan-500/10 rounded-lg p-4">
            <div className="font-display text-[1.6rem] font-extrabold text-cyan-400">{mins}:{secs}</div>
            <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mt-1">Time</div>
          </div>
        </div>
        <button onClick={onNewGame}
          className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[13px]
                     tracking-widest py-3 rounded-sm transition-all duration-200
                     hover:shadow-[0_0_20px_rgba(0,200,255,0.4)]">
          Play Again
        </button>
      </div>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────
export default function PuzzleGame15() {
  const [board,        setBoard]        = useState(() => shuffleArray());
  const [moves,        setMoves]        = useState(0);
  const [time,         setTime]         = useState(0);
  const [timerActive,  setTimerActive]  = useState(false);
  const [win,          setWin]          = useState(false);
  const [selectedIdx,  setSelectedIdx]  = useState(null); // tapped tile index

  // Touch swipe
  const touchStart = useRef(null);

  // ── Move a tile at fromIdx into the empty space ────────
  const moveTile = useCallback((fromIdx) => {
    setBoard(prev => {
      const emptyIdx = prev.indexOf("");
      const diff = Math.abs(fromIdx - emptyIdx);
      const sameRow = Math.floor(fromIdx / 4) === Math.floor(emptyIdx / 4);

      // Only move if adjacent (no row-wrap for horizontal)
      if (diff === 4 || (diff === 1 && sameRow)) {
        const next = [...prev];
        [next[fromIdx], next[emptyIdx]] = [next[emptyIdx], next[fromIdx]];

        setMoves(m => {
          const newMoves = m + 1;
          if (newMoves === 1) setTimerActive(true);
          return newMoves;
        });

        if (checkWin(next)) {
          setTimerActive(false);
          setWin(true);
        }

        return next;
      }
      return prev;
    });
    setSelectedIdx(null);
  }, []);

  // ── Tap on a filled tile ───────────────────────────────
  const handleTileClick = useCallback((index) => {
    if (win) return;
    const emptyIdx = board.indexOf("");
    const diff = Math.abs(index - emptyIdx);
    const sameRow = Math.floor(index / 4) === Math.floor(emptyIdx / 4);

    // If adjacent to empty → move immediately
    if (diff === 4 || (diff === 1 && sameRow)) {
      moveTile(index);
    } else {
      // Select / deselect
      setSelectedIdx(prev => prev === index ? null : index);
    }
  }, [board, win, moveTile]);

  // ── Tap on empty tile ──────────────────────────────────
  const handleEmptyClick = useCallback(() => {
    if (selectedIdx !== null) moveTile(selectedIdx);
  }, [selectedIdx, moveTile]);

  // ── Arrow keys ─────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) return;
      e.preventDefault();
      setBoard(prev => {
        const emptyIdx = prev.indexOf("");
        const emptyRow = Math.floor(emptyIdx / 4);
        const emptyCol = emptyIdx % 4;
        let tileIdx = null;

        if (e.key === "ArrowLeft"  && emptyCol < 3) tileIdx = emptyIdx + 1;
        if (e.key === "ArrowRight" && emptyCol > 0) tileIdx = emptyIdx - 1;
        if (e.key === "ArrowUp"    && emptyRow < 3) tileIdx = emptyIdx + 4;
        if (e.key === "ArrowDown"  && emptyRow > 0) tileIdx = emptyIdx - 4;

        if (tileIdx === null) return prev;

        const next = [...prev];
        [next[tileIdx], next[emptyIdx]] = [next[emptyIdx], next[tileIdx]];

        setMoves(m => {
          const nm = m + 1;
          if (nm === 1) setTimerActive(true);
          return nm;
        });
        if (checkWin(next)) { setTimerActive(false); setWin(true); }
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Swipe gestures ─────────────────────────────────────
  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;

    setBoard(prev => {
      const emptyIdx = prev.indexOf("");
      const emptyRow = Math.floor(emptyIdx / 4);
      const emptyCol = emptyIdx % 4;
      let tileIdx = null;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && emptyCol > 0) tileIdx = emptyIdx - 1; // swipe right → move left tile
        if (dx < 0 && emptyCol < 3) tileIdx = emptyIdx + 1;
      } else {
        if (dy > 0 && emptyRow > 0) tileIdx = emptyIdx - 4;
        if (dy < 0 && emptyRow < 3) tileIdx = emptyIdx + 4;
      }

      if (tileIdx === null) return prev;

      const next = [...prev];
      [next[tileIdx], next[emptyIdx]] = [next[emptyIdx], next[tileIdx]];

      setMoves(m => {
        const nm = m + 1;
        if (nm === 1) setTimerActive(true);
        return nm;
      });
      if (checkWin(next)) { setTimerActive(false); setWin(true); }
      return next;
    });
    touchStart.current = null;
  };

  const newGame = () => {
    setBoard(shuffleArray());
    setMoves(0);
    setTime(0);
    setTimerActive(false);
    setWin(false);
    setSelectedIdx(null);
  };

  return (
    <div className="flex flex-col items-center gap-6 pb-16 select-none">

      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧩</span>
          <h1 className="font-display text-[1.4rem] font-extrabold text-slate-100">15 Puzzle</h1>
        </div>
        <button onClick={newGame}
          className="font-mono text-[12px] text-slate-500 border border-cyan-500/15
                     px-4 py-2 rounded-sm hover:border-cyan-400 hover:text-cyan-400
                     transition-all duration-200 tracking-widest">
          ↺ New Game
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3">
        <StatBox label="Moves" value={moves} />
        <div className="flex items-center bg-[#141c26] border border-cyan-500/10 rounded-lg px-5 py-3">
          <Timer time={time} setTime={setTime} timerActive={timerActive} />
        </div>
      </div>

      {/* How to play */}
      <p className="font-mono text-[11px] text-slate-600 tracking-wide text-center px-4">
        <span className="text-cyan-400">Tap</span> an adjacent tile to move it · or{" "}
        <span className="text-cyan-400">tap</span> any tile then{" "}
        <span className="text-cyan-400">tap</span> the empty space ·{" "}
        <span className="text-cyan-400 hidden sm:inline">arrow keys</span>
        <span className="text-cyan-400 sm:hidden">swipe</span> also work
      </p>

      {/* Board */}
      <div
        className="w-full max-w-sm px-2"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Puzzle
          shuffledArray={board}
          selectedIndex={selectedIdx}
          onTileClick={handleTileClick}
          onEmptyClick={handleEmptyClick}
          isSolved={win}
        />
      </div>

      {/* Tile legend */}
      <div className="w-full max-w-sm bg-[#141c26] border border-cyan-500/10 rounded-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-cyan-500/30 border border-cyan-500/30 inline-block" />
            <span className="font-mono text-[11px] text-slate-500">Correct position</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-cyan-400/20 border border-cyan-400 inline-block" />
            <span className="font-mono text-[11px] text-slate-500">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-emerald-400/15 border border-emerald-400/40 inline-block" />
            <span className="font-mono text-[11px] text-slate-500">Solved!</span>
          </div>
        </div>
      </div>

      {/* Win modal */}
      {win && <WinBanner moves={moves} time={time} onNewGame={newGame} />}
    </div>
  );
}
