// src/pages/Games/Sudoku/index.jsx
import { useState, useCallback, useEffect, useRef } from "react";
import { generatePuzzle, getConflicts } from "./sudokuLogic";

// ── Constants ────────────────────────────────────────────────
const DIGITS = [1,2,3,4,5,6,7,8,9];

// How many of each digit are placed (clue + user)
function countDigits(board) {
  const counts = {};
  DIGITS.forEach(d => counts[d] = 0);
  board.forEach(row => row.forEach(v => { if (v) counts[v]++; }));
  return counts;
}

// ── Difficulty picker ────────────────────────────────────────
function DifficultyPicker({ onStart }) {
  const LEVELS = [
    { key: "easy",   label: "Easy",      sub: "36 clues", cls: "border-emerald-500/30 hover:border-emerald-400 text-emerald-400" },
    { key: "medium", label: "Medium",    sub: "27 clues", cls: "border-amber-500/30   hover:border-amber-400   text-amber-400"   },
    { key: "hard",   label: "Nightmare", sub: "20 clues", cls: "border-red-500/30     hover:border-red-400     text-red-400"     },
  ];
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔢</div>
        <h1 className="font-display text-[2.5rem] font-extrabold text-slate-100 mb-2">Sudoku</h1>
        <p className="font-mono text-[13px] text-slate-500 max-w-sm">
          Fill every row, column, and 3×3 box with digits 1–9.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[700px]">
        {LEVELS.map(({ key, label, sub, cls }) => (
          <button key={key} onClick={() => onStart(key)}
            className={`flex flex-col items-center gap-2 bg-[#141c26] border rounded-2xl p-8
                        transition-all duration-200 hover:-translate-y-1
                        hover:shadow-[0_0_24px_rgba(0,200,255,0.1)] ${cls}`}>
            <span className={`font-display font-extrabold text-[1.4rem]`}>{label}</span>
            <span className="font-mono text-[11px] text-slate-500">{sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Sudoku Cell ──────────────────────────────────────────────
function SudokuCell({
  cell, puzzle, isSelected, isHighlightRow, isHighlightCol, isHighlightBox,
  isHighlightNum, isConflict, noteSet, onClick, isSolved,
}) {
  const isClue     = puzzle[cell.r][cell.c] !== 0;
  const val        = cell.val;
  const notes      = [...(noteSet || [])].sort();
  const showNotes  = !val && notes.length > 0;

  // Border for 3x3 box
  const borderR = (cell.c + 1) % 3 === 0 && cell.c !== 8 ? "border-r-[2px] border-r-cyan-500/40" : "border-r border-r-[#1a2535]";
  const borderB = (cell.r + 1) % 3 === 0 && cell.r !== 8 ? "border-b-[2px] border-b-cyan-500/40" : "border-b border-b-[#1a2535]";

  let bg = "bg-[#0f1923]";
  if (isSelected)                                 bg = "bg-[#1e3a5f]";
  else if (isHighlightNum && val)                 bg = "bg-[#1a3050]";
  else if (isHighlightRow || isHighlightCol || isHighlightBox) bg = "bg-[#141c26]";

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer
                  aspect-square select-none transition-colors duration-100
                  ${borderR} ${borderB} ${bg}`}
    >
      {showNotes ? (
        <div className="grid grid-cols-3 w-full h-full p-[1px]">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <span key={n}
              className={`flex items-center justify-center font-mono
                          ${notes.includes(n) ? "text-cyan-400" : "text-transparent"}
                          text-[clamp(6px,1.2vw,10px)]`}>
              {n}
            </span>
          ))}
        </div>
      ) : val ? (
        <span className={`font-display font-bold select-none
                          text-[clamp(14px,3vw,22px)]
                          ${isConflict  ? "text-red-400"    : ""}
                          ${!isConflict && isClue  ? "text-slate-200"  : ""}
                          ${!isConflict && !isClue && isSolved ? "text-emerald-400" : ""}
                          ${!isConflict && !isClue && !isSolved ? "text-blue-400" : ""}
                         `}>
          {val}
        </span>
      ) : null}

      {/* Selected ring */}
      {isSelected && (
        <div className="absolute inset-0 ring-2 ring-cyan-400 ring-inset pointer-events-none" />
      )}
    </div>
  );
}

// ── Number pad ───────────────────────────────────────────────
function NumPad({ selectedNum, onNumSelect, onErase, counts, noteMode, onToggleNote }) {
  const longPressRef = useRef(null);

  const handlePressStart = (num) => {
    longPressRef.current = setTimeout(() => {
      onNumSelect(num, true); // true = long press → sticky select
    }, 400);
  };

  const handlePressEnd = (num, e) => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  const handleClick = (num) => {
    onNumSelect(num, false);
  };

  return (
    <div className="w-full">
      {/* Tool row */}
      <div className="flex justify-around mb-3 px-2">
        <button onClick={() => onErase()}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400
                     transition-colors duration-150">
          <span className="text-xl">⌫</span>
          <span className="font-mono text-[10px] tracking-widest">Erase</span>
        </button>
        <button onClick={onToggleNote}
          className={`flex flex-col items-center gap-1 transition-colors duration-150
                      ${noteMode ? "text-cyan-400" : "text-slate-400 hover:text-cyan-400"}`}>
          <span className="text-xl relative">
            ✏️
            {noteMode && (
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-cyan-400" />
            )}
          </span>
          <span className="font-mono text-[10px] tracking-widest">
            Notes {noteMode ? "ON" : "OFF"}
          </span>
        </button>
      </div>

      {/* Digit row */}
      <div className="grid grid-cols-9 gap-1">
        {DIGITS.map(n => {
          const full    = counts[n] >= 9;
          const active  = selectedNum === n;
          return (
            <button
              key={n}
              disabled={full}
              onClick={() => handleClick(n)}
              onMouseDown={() => handlePressStart(n)}
              onMouseUp={(e) => handlePressEnd(n, e)}
              onTouchStart={() => handlePressStart(n)}
              onTouchEnd={(e) => handlePressEnd(n, e)}
              className={`
                flex flex-col items-center justify-center
                aspect-square rounded-xl font-display font-bold
                text-[clamp(16px,4vw,28px)] transition-all duration-150
                select-none active:scale-90
                ${full ? "opacity-20 cursor-not-allowed text-slate-600 bg-transparent" : ""}
                ${!full && active
                  ? "bg-blue-500 text-white shadow-[0_0_16px_rgba(59,130,246,0.5)]"
                  : !full ? "bg-[#1a2535] text-blue-300 hover:bg-[#223045] hover:text-blue-200"
                  : ""}
              `}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function Sudoku() {
  const [difficulty,   setDifficulty]   = useState(null);
  const [puzzle,       setPuzzle]       = useState(null);
  const [solution,     setSolution]     = useState(null);
  const [board,        setBoard]        = useState(null);
  const [selected,     setSelected]     = useState(null);   // "r-c"
  const [selectedNum,  setSelectedNum]  = useState(null);   // sticky selected number
  const [notes,        setNotes]        = useState({});     // { "r-c": Set }
  const [noteMode,     setNoteMode]     = useState(false);
  const [mistakes,     setMistakes]     = useState(0);
  const [won,          setWon]          = useState(false);
  const [elapsed,      setElapsed]      = useState(0);
  const [timerOn,      setTimerOn]      = useState(false);
  const [history,      setHistory]      = useState([]);     // for undo
  const [stickyNum,    setStickyNum]    = useState(false);  // long-press mode

  // Timer
  useEffect(() => {
    if (!timerOn) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [timerOn]);

  const start = (diff) => {
    const { puzzle: p, solution: s } = generatePuzzle(diff);
    setDifficulty(diff);
    setPuzzle(p.map(r => [...r]));
    setSolution(s);
    setBoard(p.map(r => [...r]));
    setSelected(null);
    setSelectedNum(null);
    setStickyNum(false);
    setNotes({});
    setNoteMode(false);
    setMistakes(0);
    setWon(false);
    setElapsed(0);
    setTimerOn(true);
    setHistory([]);
  };

  const conflicts = board ? getConflicts(board) : new Set();

  // Determine highlight state
  const getHighlights = useCallback((r, c) => {
    if (!selected && !selectedNum) return {};
    const [sr, sc] = selected ? selected.split("-").map(Number) : [null, null];
    const selVal   = selected && board ? board[sr][sc] : null;
    const numToHL  = selectedNum ?? selVal;

    return {
      isSelected:      selected === `${r}-${c}`,
      isHighlightRow:  sr !== null && r === sr,
      isHighlightCol:  sc !== null && c === sc,
      isHighlightBox:  sr !== null && Math.floor(r/3) === Math.floor(sr/3)
                       && Math.floor(c/3) === Math.floor(sc/3),
      isHighlightNum:  numToHL && board[r][c] === numToHL,
    };
  }, [selected, selectedNum, board]);

  // Place a number
  const placeNumber = useCallback((num, targetKey = null) => {
    const key = targetKey ?? selected;
    if (!key || won) return;
    const [r, c] = key.split("-").map(Number);
    if (puzzle[r][c] !== 0) return;

    if (noteMode) {
      setNotes(prev => {
        const cur = new Set(prev[key] ?? []);
        cur.has(num) ? cur.delete(num) : cur.add(num);
        return { ...prev, [key]: cur };
      });
      return;
    }

    // Save to history
    setHistory(h => [...h, { board: board.map(r => [...r]), notes: {...notes}, key }]);

    const next = board.map(row => [...row]);
    next[r][c] = next[r][c] === num ? 0 : num;
    setBoard(next);

    // Mistake check
    if (num !== 0 && num !== solution[r][c]) setMistakes(m => m + 1);

    // Clear notes for this cell
    setNotes(prev => ({ ...prev, [key]: new Set() }));

    // Win check
    if (next.every((row, ri) => row.every((v, ci) => v === solution[ri][ci]))) {
      setWon(true);
      setTimerOn(false);
    }

    // If not sticky, clear selectedNum after placing
    if (!stickyNum) setSelectedNum(null);
  }, [selected, board, puzzle, solution, noteMode, notes, won, stickyNum]);

  // Undo
  const undo = useCallback(() => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setBoard(prev.board);
    setNotes(prev.notes);
    setHistory(h => h.slice(0, -1));
  }, [history]);

  // Cell click
  const handleCellClick = useCallback((r, c) => {
    const key = `${r}-${c}`;
    const isClue = puzzle[r][c] !== 0;

    // If a number is sticky-selected and cell is empty → place it
    if (selectedNum && !isClue) {
      placeNumber(selectedNum, key);
      setSelected(key);
      return;
    }

    // Otherwise select the cell
    setSelected(key);

    // If cell has a value, highlight that number
    if (board[r][c] !== 0) {
      setSelectedNum(board[r][c]);
    }
  }, [puzzle, board, selectedNum, placeNumber]);

  // Number pad press
  const handleNumSelect = useCallback((num, isLong) => {
    if (isLong) {
      // Long press → sticky mode
      setStickyNum(true);
      setSelectedNum(prev => prev === num ? null : num);
      setSelected(null);
      return;
    }

    // Short tap
    setStickyNum(false);
    if (selected) {
      const [r, c] = selected.split("-").map(Number);
      if (puzzle[r][c] === 0) {
        placeNumber(num);
        setSelectedNum(num);
        return;
      }
    }
    // No cell selected → just highlight
    setSelectedNum(prev => prev === num ? null : num);
  }, [selected, puzzle, placeNumber]);

  const handleErase = useCallback(() => {
    if (!selected) return;
    const [r, c] = selected.split("-").map(Number);
    if (puzzle[r][c] !== 0) return;
    setHistory(h => [...h, { board: board.map(r => [...r]), notes: {...notes}, key: selected }]);
    const next = board.map(row => [...row]);
    next[r][c] = 0;
    setBoard(next);
    setNotes(prev => ({ ...prev, [selected]: new Set() }));
  }, [selected, board, puzzle, notes]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key >= "1" && e.key <= "9") {
        const n = Number(e.key);
        if (selected) placeNumber(n);
        else setSelectedNum(prev => prev === n ? null : n);
      }
      if (e.key === "Backspace" || e.key === "Delete") handleErase();
      if (e.key === "n" || e.key === "N") setNoteMode(m => !m);
      if ((e.ctrlKey || e.metaKey) && e.key === "z") undo();
      // Arrow keys to move selection
      if (!selected) return;
      const [r, c] = selected.split("-").map(Number);
      const moves  = { ArrowUp:[-1,0], ArrowDown:[1,0], ArrowLeft:[0,-1], ArrowRight:[0,1] };
      if (moves[e.key]) {
        e.preventDefault();
        const [dr, dc] = moves[e.key];
        const nr = Math.max(0, Math.min(8, r + dr));
        const nc = Math.max(0, Math.min(8, c + dc));
        setSelected(`${nr}-${nc}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, placeNumber, handleErase, undo]);

  const mins   = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs   = String(elapsed % 60).padStart(2, "0");
  const counts = board ? countDigits(board) : {};

  const diffLabel = { easy: "Easy", medium: "Medium", hard: "Nightmare" };
  const diffColor = {
    easy:   "text-emerald-400",
    medium: "text-amber-400",
    hard:   "text-red-400",
  };

  if (!difficulty) return <DifficultyPicker onStart={start} />;

  return (
    <div className="flex flex-col items-center gap-4 pb-16 max-w-sm mx-auto px-2">

      {/* Status bar */}
      <div className="w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <span className={`font-mono font-bold text-[13px] ${diffColor[difficulty]}`}>
            {diffLabel[difficulty]}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[13px] text-slate-400">
            Mistake: <span className={mistakes > 2 ? "text-red-400" : "text-slate-300"}>{mistakes}/3</span>
          </span>
          <span className="font-mono text-[13px] text-slate-300 tabular-nums">{mins}:{secs}</span>
          <button onClick={() => { setTimerOn(false); setDifficulty(null); }}
            className="font-mono text-[11px] text-slate-600 hover:text-cyan-400 transition-colors">
            ✕
          </button>
        </div>
      </div>

      {/* Win banner */}
      {won && (
        <div className="w-full bg-emerald-400/15 border border-emerald-400/30 rounded-xl p-4 text-center">
          <p className="font-display font-extrabold text-emerald-400 text-xl mb-1">🎉 Puzzle Solved!</p>
          <p className="font-mono text-[12px] text-slate-500">Time: {mins}:{secs} · Mistakes: {mistakes}</p>
          <button onClick={() => start(difficulty)}
            className="mt-3 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[12px]
                       tracking-widest px-6 py-2 rounded-sm transition-all duration-200">
            New Puzzle
          </button>
        </div>
      )}

      {/* Sticky num indicator */}
      {stickyNum && selectedNum && (
        <div className="w-full flex items-center justify-between bg-blue-500/15 border
                        border-blue-500/30 rounded-lg px-4 py-2">
          <span className="font-mono text-[12px] text-blue-400">
            Long-press mode — tap any empty cell to place <strong>{selectedNum}</strong>
          </span>
          <button onClick={() => { setStickyNum(false); setSelectedNum(null); }}
            className="font-mono text-[11px] text-slate-500 hover:text-red-400">✕</button>
        </div>
      )}

      {/* Grid */}
      <div className="w-full border-2 border-cyan-500/40 rounded-xl overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns: "repeat(9, 1fr)" }}>
          {board.map((row, r) =>
            row.map((val, c) => {
              const h = getHighlights(r, c);
              return (
                <SudokuCell
                  key={`${r}-${c}`}
                  cell={{ r, c, val }}
                  puzzle={puzzle}
                  {...h}
                  isConflict={conflicts.has(`${r}-${c}`)}
                  noteSet={notes[`${r}-${c}`]}
                  isSolved={won}
                  onClick={() => handleCellClick(r, c)}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Number pad */}
      <div className="w-full bg-[#0d1117] border border-cyan-500/10 rounded-2xl p-4">
        <NumPad
          selectedNum={selectedNum}
          onNumSelect={handleNumSelect}
          onErase={handleErase}
          counts={counts}
          noteMode={noteMode}
          onToggleNote={() => setNoteMode(m => !m)}
        />
      </div>

      {/* Undo */}
      <div className="flex gap-3 w-full">
        <button onClick={undo} disabled={!history.length}
          className="flex-1 flex items-center justify-center gap-2 font-mono text-[12px]
                     text-slate-500 border border-cyan-500/10 rounded-lg py-2.5
                     hover:border-cyan-400 hover:text-cyan-400 transition-all duration-200
                     disabled:opacity-30 disabled:cursor-not-allowed tracking-widest">
          ↩ Undo
        </button>
        <button onClick={() => start(difficulty)}
          className="flex-1 flex items-center justify-center gap-2 font-mono text-[12px]
                     text-slate-500 border border-cyan-500/10 rounded-lg py-2.5
                     hover:border-cyan-400 hover:text-cyan-400 transition-all duration-200 tracking-widest">
          ↺ New
        </button>
      </div>

      <p className="font-mono text-[10px] text-slate-700 text-center">
        Tap cell or number · Long-press number for sticky mode · N = notes · ← → ↑ ↓ navigate
      </p>
    </div>
  );
}
