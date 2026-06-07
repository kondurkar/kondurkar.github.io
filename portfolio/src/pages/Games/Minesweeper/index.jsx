// src/pages/Games/Minesweeper/index.jsx
import { useState, useCallback, useEffect } from "react";
import { CONFIGS, createBoard, floodReveal, checkWin } from "./minesweeperLogic";

const NUM_COLORS = {
  1: "text-blue-400",
  2: "text-emerald-400",
  3: "text-red-400",
  4: "text-purple-400",
  5: "text-amber-600",
  6: "text-cyan-400",
  7: "text-pink-400",
  8: "text-slate-400",
};

function Cell({ cell, onClick, onFlag, gameOver }) {
  const handleContext = (e) => { e.preventDefault(); onFlag(); };

  let content = "";
  let cls = "bg-[#141c26] border-cyan-500/15 hover:border-cyan-500/30 hover:bg-[#1a2535] cursor-pointer";

  if (cell.revealed) {
    if (cell.mine) {
      content = "💣";
      cls = "bg-red-500/20 border-red-500/40 cursor-default";
    } else {
      cls = "bg-[#0d1117] border-cyan-500/8 cursor-default";
      content = cell.adjacent > 0
        ? <span className={`font-display font-extrabold text-[0.85rem] ${NUM_COLORS[cell.adjacent]}`}>{cell.adjacent}</span>
        : "";
    }
  } else if (cell.flagged) {
    content = "🚩";
    cls = "bg-[#141c26] border-amber-500/30 cursor-pointer";
  }

  return (
    <div
      onClick={onClick}
      onContextMenu={handleContext}
      className={`flex items-center justify-center border rounded select-none
                  transition-colors duration-100 aspect-square text-sm
                  ${cls}`}
    >
      {content}
    </div>
  );
}

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState(null);
  const [board,      setBoard]      = useState(null);
  const [status,     setStatus]     = useState("idle"); // idle | playing | won | lost
  const [firstClick, setFirstClick] = useState(true);
  const [flagMode,   setFlagMode]   = useState(false);
  const [elapsed,    setElapsed]    = useState(0);
  const [timerOn,    setTimerOn]    = useState(false);
  const [minesLeft,  setMinesLeft]  = useState(0);

  // Timer
  useEffect(() => {
    if (!timerOn) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [timerOn]);

  const start = (diff) => {
    const cfg = CONFIGS[diff];
    setDifficulty(diff);
    setBoard(createBoard(cfg));
    setStatus("playing");
    setFirstClick(true);
    setFlagMode(false);
    setElapsed(0);
    setTimerOn(false);
    setMinesLeft(cfg.mines);
  };

  const handleClick = useCallback((r, c) => {
    if (!board || status !== "playing") return;
    const cell = board[r][c];
    if (cell.flagged) return;

    if (flagMode) {
      handleFlag(r, c);
      return;
    }

    const cfg = CONFIGS[difficulty];

    // First click — regenerate board to ensure safe start
    let workBoard = board;
    if (firstClick) {
      workBoard = createBoard(cfg, [r, c]);
      setFirstClick(false);
      setTimerOn(true);
    }

    if (workBoard[r][c].mine) {
      // Reveal all mines
      const blown = workBoard.map(row =>
        row.map(cell => cell.mine ? { ...cell, revealed: true } : cell)
      );
      blown[r][c] = { ...blown[r][c], exploded: true };
      setBoard(blown);
      setStatus("lost");
      setTimerOn(false);
      return;
    }

    const next = floodReveal(workBoard, r, c, cfg.rows, cfg.cols);
    setBoard(next);

    if (checkWin(next)) {
      setStatus("won");
      setTimerOn(false);
    }
  }, [board, status, firstClick, difficulty, flagMode]);

  const handleFlag = useCallback((r, c) => {
    if (!board || status !== "playing") return;
    const cell = board[r][c];
    if (cell.revealed) return;
    const next = board.map(row => row.map(c2 => ({ ...c2 })));
    next[r][c].flagged = !next[r][c].flagged;
    setBoard(next);
    setMinesLeft(m => next[r][c].flagged ? m - 1 : m + 1);
  }, [board, status]);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");

  // Difficulty picker
  if (!difficulty) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="text-5xl mb-2">💣</div>
      <h1 className="font-display text-[2rem] font-extrabold text-slate-100">Minesweeper</h1>
      <p className="font-mono text-[13px] text-slate-500 text-center max-w-sm">
        Reveal all safe cells without hitting a mine. Right-click or flag mode to plant flags.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mt-2">
        {Object.entries(CONFIGS).map(([key, { rows, cols, mines }]) => (
          <button key={key} onClick={() => start(key)}
            className={`flex flex-col items-center gap-1.5 bg-[#141c26] border rounded-xl p-6
                        transition-all duration-200 hover:-translate-y-1 capitalize
                        ${key === "easy"   ? "border-emerald-500/20 hover:border-emerald-400" : ""}
                        ${key === "medium" ? "border-amber-500/20   hover:border-amber-400"   : ""}
                        ${key === "hard"   ? "border-red-500/20     hover:border-red-400"     : ""}
                       `}>
            <span className="font-display font-bold text-slate-100 text-[1.1rem] capitalize">{key}</span>
            <span className="font-mono text-[11px] text-slate-500">{rows}×{cols}</span>
            <span className="font-mono text-[11px] text-slate-600">{mines} mines</span>
          </button>
        ))}
      </div>
    </div>
  );

  const cfg = CONFIGS[difficulty];

  return (
    <div className="flex flex-col items-center gap-4 pb-16">

      {/* Header */}
      <div className="w-full max-w-3xl flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">💣</span>
          <h1 className="font-display text-[1.3rem] font-extrabold text-slate-100">Minesweeper</h1>
          <span className={`font-mono text-[10px] border px-2 py-0.5 rounded-sm tracking-wide capitalize
            ${difficulty === "easy"   ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : ""}
            ${difficulty === "medium" ? "text-amber-400   bg-amber-400/10   border-amber-400/20"   : ""}
            ${difficulty === "hard"   ? "text-red-400     bg-red-400/10     border-red-400/20"     : ""}
          `}>{difficulty}</span>
        </div>
        <button onClick={() => { setDifficulty(null); setTimerOn(false); }}
          className="font-mono text-[12px] text-slate-500 hover:text-cyan-400 transition-colors">
          ← Menu
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 flex-wrap justify-center">
        <div className="flex items-center gap-2 bg-[#141c26] border border-cyan-500/10 rounded-lg px-4 py-2">
          <span className="text-base">🚩</span>
          <span className="font-mono font-bold text-cyan-400 tabular-nums">{minesLeft}</span>
        </div>
        <div className="flex items-center gap-2 bg-[#141c26] border border-cyan-500/10 rounded-lg px-4 py-2">
          <span className="font-mono font-bold text-cyan-400 tabular-nums">{mins}:{secs}</span>
        </div>
        <button
          onClick={() => setFlagMode(f => !f)}
          className={`flex items-center gap-2 border rounded-lg px-4 py-2 font-mono text-[12px]
                      tracking-widest transition-all duration-200
                      ${flagMode
                        ? "bg-amber-400 text-black border-amber-400"
                        : "bg-[#141c26] text-slate-500 border-cyan-500/10 hover:border-amber-400 hover:text-amber-400"
                      }`}>
          🚩 {flagMode ? "Flag ON" : "Flag OFF"}
        </button>
        <button onClick={() => start(difficulty)}
          className="font-mono text-[12px] text-slate-500 border border-cyan-500/15
                     px-4 py-2 rounded-lg hover:border-cyan-400 hover:text-cyan-400
                     transition-all duration-200 tracking-widest">
          ↺ Restart
        </button>
      </div>

      {/* Status banner */}
      {(status === "won" || status === "lost") && (
        <div className={`w-full max-w-3xl text-center rounded-xl border p-4 flex items-center
                         justify-between flex-wrap gap-3
                         ${status === "won" ? "bg-emerald-400/10 border-emerald-400/30" : "bg-red-400/10 border-red-400/30"}`}>
          <div>
            <p className={`font-display font-bold text-xl ${status === "won" ? "text-emerald-400" : "text-red-400"}`}>
              {status === "won" ? "🎉 You Win!" : "💥 Boom!"}
            </p>
            <p className="font-mono text-[12px] text-slate-500">
              {status === "won" ? `Time: ${mins}:${secs}` : "Hit a mine!"}
            </p>
          </div>
          <button onClick={() => start(difficulty)}
            className="bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[12px]
                       tracking-widest px-6 py-2.5 rounded-sm transition-all duration-200">
            Play Again
          </button>
        </div>
      )}

      {/* Board */}
      <div className="overflow-x-auto w-full max-w-3xl">
        <div
          className="grid gap-0.5 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${cfg.cols}, minmax(0, 1fr))`,
            width: `${Math.min(cfg.cols * 34, window.innerWidth - 32)}px`,
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <Cell
                key={`${r}-${c}`}
                cell={cell}
                gameOver={status !== "playing"}
                onClick={() => handleClick(r, c)}
                onFlag={() => handleFlag(r, c)}
              />
            ))
          )}
        </div>
      </div>

      <p className="font-mono text-[10px] text-slate-700 text-center">
        Left click = reveal · Right click or 🚩 button = flag · First click is always safe
      </p>
    </div>
  );
}
