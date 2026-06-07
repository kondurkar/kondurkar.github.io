// src/pages/Games/TicTacToe/index.jsx
import { useState, useEffect, useCallback } from "react";
import { getBestMove, checkWinner, getWinningLine } from "./minimax";

const EMPTY = Array(9).fill(null);

function Cell({ value, index, onClick, isWinning, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || !!value}
      className={`
        aspect-square w-full flex items-center justify-center
        font-display font-extrabold text-[2.5rem] rounded-xl border
        transition-all duration-150 select-none
        ${isWinning
          ? value === "X"
            ? "bg-cyan-400/20 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(0,200,255,0.3)]"
            : "bg-emerald-400/20 border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
          : value === "X"
          ? "bg-[#141c26] border-cyan-500/30 text-cyan-400"
          : value === "O"
          ? "bg-[#141c26] border-emerald-500/30 text-emerald-400"
          : "bg-[#141c26] border-cyan-500/10 text-transparent hover:border-cyan-500/30 hover:bg-[#1a2535] active:scale-95 cursor-pointer"
        }
        ${disabled && !value ? "cursor-not-allowed opacity-60" : ""}
      `}
    >
      {value === "X" ? "✕" : value === "O" ? "○" : ""}
    </button>
  );
}

export default function TicTacToe() {
  const [board,     setBoard]     = useState(EMPTY);
  const [isX,      setIsX]       = useState(true);   // X = human always
  const [mode,     setMode]       = useState(null);   // null | "ai" | "2p"
  const [scores,   setScores]     = useState({ X: 0, O: 0, draw: 0 });
  const [thinking, setThinking]   = useState(false);

  const winner    = checkWinner(board);
  const winLine   = getWinningLine(board);
  const isDraw    = !winner && board.every(Boolean);
  const gameOver  = !!winner || isDraw;

  // AI move
  useEffect(() => {
    if (mode !== "ai" || isX || gameOver) return;
    setThinking(true);
    const timeout = setTimeout(() => {
      const { index } = getBestMove(board, true);
      setBoard(prev => {
        const next = [...prev];
        next[index] = "O";
        return next;
      });
      setIsX(true);
      setThinking(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [board, isX, mode, gameOver]);

  // Track score on game over
  useEffect(() => {
    if (!gameOver || !mode) return;
    setScores(s => ({
      ...s,
      ...(winner ? { [winner]: s[winner] + 1 } : { draw: s.draw + 1 }),
    }));
  }, [gameOver]);

  const handleClick = useCallback((i) => {
    if (gameOver || board[i] || thinking) return;
    if (mode === "ai" && !isX) return;
    const next = [...board];
    next[i] = isX ? "X" : "O";
    setBoard(next);
    setIsX(x => !x);
  }, [board, gameOver, isX, mode, thinking]);

  const reset = () => { setBoard(EMPTY); setIsX(true); setThinking(false); };
  const fullReset = () => { reset(); setScores({ X: 0, O: 0, draw: 0 }); setMode(null); };

  const status = gameOver
    ? winner
      ? `${winner === "X" ? (mode === "ai" ? "You win! 🎉" : "X wins!") : (mode === "ai" ? "AI wins 🤖" : "O wins!")} `
      : "It's a draw!"
    : thinking
    ? "AI is thinking..."
    : mode === "ai"
    ? isX ? "Your turn (X)" : "AI's turn (O)"
    : `Player ${isX ? "X" : "O"}'s turn`;

  // Mode picker
  if (!mode) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="text-5xl mb-2">❌⭕</div>
      <h1 className="font-display text-[2rem] font-extrabold text-slate-100">Tic Tac Toe</h1>
      <p className="font-mono text-[13px] text-slate-500 text-center max-w-sm">
        Beat the unbeatable AI or play with a friend
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm mt-4">
        <button onClick={() => setMode("ai")}
          className="flex flex-col items-center gap-2 bg-[#141c26] border border-cyan-500/20
                     rounded-xl p-6 hover:border-cyan-400 hover:bg-[#1a2535]
                     transition-all duration-200 hover:-translate-y-1">
          <span className="text-3xl">🤖</span>
          <span className="font-display font-bold text-slate-100">vs AI</span>
          <span className="font-mono text-[11px] text-slate-500">Minimax algorithm</span>
        </button>
        <button onClick={() => setMode("2p")}
          className="flex flex-col items-center gap-2 bg-[#141c26] border border-emerald-500/20
                     rounded-xl p-6 hover:border-emerald-400 hover:bg-[#1a2535]
                     transition-all duration-200 hover:-translate-y-1">
          <span className="text-3xl">👥</span>
          <span className="font-display font-bold text-slate-100">2 Players</span>
          <span className="font-mono text-[11px] text-slate-500">Pass & play</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 pb-16">

      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">❌⭕</span>
          <h1 className="font-display text-[1.4rem] font-extrabold text-slate-100">Tic Tac Toe</h1>
          <span className="font-mono text-[10px] border px-2 py-0.5 rounded-sm tracking-wide
                           text-cyan-400 bg-cyan-400/10 border-cyan-400/20">
            {mode === "ai" ? "vs AI" : "2P"}
          </span>
        </div>
        <button onClick={fullReset}
          className="font-mono text-[12px] text-slate-500 hover:text-cyan-400 transition-colors">
          ← Menu
        </button>
      </div>

      {/* Scoreboard */}
      <div className="flex gap-3 w-full max-w-sm">
        {[
          { key: "X", label: mode === "ai" ? "You (X)" : "X",  color: "text-cyan-400"    },
          { key: "draw", label: "Draw", color: "text-slate-500" },
          { key: "O", label: mode === "ai" ? "AI (O)"  : "O",  color: "text-emerald-400" },
        ].map(({ key, label, color }) => (
          <div key={key} className="flex-1 flex flex-col items-center bg-[#141c26]
                                    border border-cyan-500/10 rounded-lg py-3">
            <span className={`font-display text-[1.6rem] font-extrabold ${color}`}>
              {scores[key]}
            </span>
            <span className="font-mono text-[10px] text-slate-600 tracking-widest uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className={`font-mono text-[13px] tracking-wide px-4 py-2 rounded-sm border
                       ${gameOver
                         ? winner ? "text-cyan-400 border-cyan-400/30 bg-cyan-400/8"
                                  : "text-slate-400 border-slate-600/30 bg-slate-800/30"
                         : "text-slate-500 border-transparent"}`}>
        {status}
      </div>

      {/* Board */}
      <div className="w-full max-w-sm">
        <div className="grid grid-cols-3 gap-3">
          {board.map((val, i) => (
            <Cell
              key={i}
              index={i}
              value={val}
              isWinning={winLine?.includes(i)}
              disabled={gameOver || thinking || (mode === "ai" && !isX)}
              onClick={() => handleClick(i)}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-sm">
        <button onClick={reset}
          className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[12px]
                     tracking-widest py-3 rounded-sm transition-all duration-200
                     hover:shadow-[0_0_20px_rgba(0,200,255,0.4)]">
          ↺ New Round
        </button>
        <button onClick={fullReset}
          className="flex-1 border border-cyan-500/25 text-cyan-400 font-mono text-[12px]
                     tracking-widest py-3 rounded-sm transition-all duration-200
                     hover:border-cyan-400 hover:bg-cyan-500/6">
          Change Mode
        </button>
      </div>

      {mode === "ai" && (
        <p className="font-mono text-[11px] text-slate-700 text-center">
          The AI uses the minimax algorithm — it never loses
        </p>
      )}
    </div>
  );
}
