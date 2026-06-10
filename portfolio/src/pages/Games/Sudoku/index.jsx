// src/pages/Games/Sudoku/index.jsx
import { useState, useCallback, useEffect, useRef } from "react";
import {
  generatePuzzle, getConflicts,
  getValidCandidates, buildAllNotes, pruneNotes,
} from "./sudokuLogic";

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
        <p className="font-mono text-[13px] text-slate-500 max-w-sm text-center">
          Fill every row, column, and 3×3 box with digits 1–9.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[700px]">
        {LEVELS.map(({ key, label, sub, cls }) => (
          <button key={key} onClick={() => onStart(key)}
            className={`flex flex-col items-center gap-2 bg-[#141c26] border rounded-2xl p-8
                        transition-all duration-200 hover:-translate-y-1
                        hover:shadow-[0_0_24px_rgba(0,200,255,0.1)] ${cls}`}>
            <span className="font-display font-extrabold text-[1.4rem]">{label}</span>
            <span className="font-mono text-[11px] text-slate-500">{sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Single cell ──────────────────────────────────────────────
function SudokuCell({ r, c, val, puzzle, solution, isSelected, isHighlightRow,
  isHighlightCol, isHighlightBox, isHighlightNum, isConflict,
  noteSet, isSolved, selectedNum, onClick }) {

  const isClue    = puzzle[r][c] !== 0;
  const notes     = noteSet ? [...noteSet].sort((a, b) => a - b) : [];
  const showNotes = !val && notes.length > 0;

  // Wrong value = user-entered but doesn't match solution
  const isWrong   = !isClue && val !== 0 && val !== solution[r][c];

  const borderR = (c + 1) % 3 === 0 && c !== 8
    ? "border-r-[2px] border-r-cyan-500/50" : "border-r border-r-[#1e2a3a]";
  const borderB = (r + 1) % 3 === 0 && r !== 8
    ? "border-b-[2px] border-b-cyan-500/50" : "border-b border-b-[#1e2a3a]";

  let bg = "bg-[#0f1923]";
  if (isSelected)          bg = "bg-[#1e3a5f]";
  else if (isWrong)        bg = "bg-red-500/10";   // subtle red tint on wrong cell
  else if (isHighlightNum) bg = "bg-[#1a3050]";
  else if (isHighlightRow || isHighlightCol || isHighlightBox) bg = "bg-[#141c26]";

  return (
    <div onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer
                  aspect-square select-none transition-colors duration-100
                  ${borderR} ${borderB} ${bg}`}>

      {showNotes ? (
        <div className="grid grid-cols-3 w-full h-full p-[1px] sm:p-[2px]">
          {[1,2,3,4,5,6,7,8,9].map(n => {
            const inNote      = notes.includes(n);
            const isHL        = inNote && selectedNum === n; // highlighted note digit
            return (
            <span key={n}
              className={`flex items-center justify-center font-mono leading-none
                            text-[clamp(5px,1vw,9px)] transition-colors duration-100
                            ${!inNote                ? "text-transparent"             : ""}
                            ${inNote && isHL         ? "text-white font-bold"         : ""}
                            ${inNote && !isHL        ? "text-cyan-400 opacity-70"     : ""}
                           `}>
              {n}
            </span>
            );
          })}
        </div>
      ) : val ? (
        <span className={`font-display font-bold select-none
                          text-[clamp(14px,3.5vw,24px)] leading-none
                          ${isWrong                                ? "text-red-400"     : ""}
                          ${!isWrong && isConflict                 ? "text-red-400"     : ""}
                          ${!isWrong && !isConflict && isClue      ? "text-slate-200"   : ""}
                          ${!isWrong && !isConflict && !isClue && isSolved  ? "text-emerald-400" : ""}
                          ${!isWrong && !isConflict && !isClue && !isSolved ? "text-blue-400"    : ""}
                         `}>
          {val}
        </span>
      ) : null}

      {isSelected && (
        <div className="absolute inset-0 ring-2 ring-inset ring-cyan-400 pointer-events-none z-10" />
      )}
    </div>
  );
}

// ── Number pad ───────────────────────────────────────────────
function NumPad({ selectedNum, onNumTap, onNumLongPress, onErase, onHint,
  onToggleNote, noteMode, counts }) {

  const timerRef  = useRef({});
  const firedRef  = useRef({});

  const onStart = (n) => {
    firedRef.current[n] = false;
    timerRef.current[n] = setTimeout(() => {
      firedRef.current[n] = true;
      onNumLongPress(n);
    }, 450);
  };

  const onEnd = (n) => {
    clearTimeout(timerRef.current[n]);
    if (!firedRef.current[n]) onNumTap(n);
  };

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Tool row */}
      <div className="grid grid-cols-3 gap-2">
        <button onClick={onErase}
          className="flex flex-col items-center justify-center gap-0.5 bg-[#1a2535]
                     border border-cyan-500/15 rounded-xl py-3
                     hover:border-cyan-400 hover:bg-[#223045] active:scale-95
                     transition-all duration-150">
          <span className="text-xl">⌫</span>
          <span className="font-mono text-[9px] text-slate-500 tracking-widest">Erase</span>
        </button>

        <button onClick={onToggleNote}
          className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-3
                      border transition-all duration-150 active:scale-95
                      ${noteMode
                        ? "bg-cyan-400/15 border-cyan-400 text-cyan-400"
                        : "bg-[#1a2535] border-cyan-500/15 text-slate-400 hover:border-cyan-400"
                      }`}>
          <span className="text-xl">✏️</span>
          <span className="font-mono text-[9px] tracking-widest">
            Notes {noteMode ? "ON" : "OFF"}
          </span>
        </button>

        <button onClick={onHint}
          className="flex flex-col items-center justify-center gap-0.5 bg-amber-400/10
                     border border-amber-400/30 rounded-xl py-3 text-amber-400
                     hover:bg-amber-400/20 hover:border-amber-400 active:scale-95
                     transition-all duration-150">
          <span className="text-xl">💡</span>
          <span className="font-mono text-[9px] tracking-widest">Hint</span>
        </button>
      </div>

      {/* Digit grid */}
      <div className="grid grid-cols-9 gap-1">
        {DIGITS.map(n => {
          const full   = counts[n] >= 9;
          const active = selectedNum === n;
          return (
            <button key={n} disabled={full}
              onMouseDown={() => onStart(n)} onMouseUp={() => onEnd(n)}
              onTouchStart={(e) => { e.preventDefault(); onStart(n); }}
              onTouchEnd={(e)   => { e.preventDefault(); onEnd(n);   }}
              className={`aspect-square rounded-xl font-display font-extrabold select-none
                          text-[clamp(16px,3.5vw,26px)] transition-all duration-150
                          active:scale-90 flex items-center justify-center
                          ${full
                            ? "opacity-15 cursor-not-allowed text-slate-600 bg-transparent border-transparent"
                            : active
                            ? "bg-blue-500 text-white shadow-[0_0_14px_rgba(59,130,246,0.6)] border border-blue-400"
                            : "bg-[#1a2535] text-blue-300 border border-cyan-500/10 hover:bg-[#223045] hover:border-cyan-500/30"
                          }`}>
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────
export default function Sudoku() {
  const [difficulty,  setDifficulty]  = useState(null);
  const [puzzle,      setPuzzle]      = useState(null);
  const [solution,    setSolution]    = useState(null);
  const [board,       setBoard]       = useState(null);
  const [selected,    setSelected]    = useState(null);
  const [selectedNum, setSelectedNum] = useState(null);
  const [stickyNum,   setStickyNum]   = useState(false);
  const [notes,       setNotes]       = useState({});
  const [noteMode,    setNoteMode]    = useState(false);
  const [mistakes,    setMistakes]    = useState(0);
  const [won,         setWon]         = useState(false);
  const [elapsed,     setElapsed]     = useState(0);
  const [timerOn,     setTimerOn]     = useState(false);
  const [history,     setHistory]     = useState([]);
  const [fullscreen,  setFullscreen]  = useState(false);
  const containerRef  = useRef(null);

  // Timer
  useEffect(() => {
    if (!timerOn) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [timerOn]);

  // Fullscreen API
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!document.fullscreenElement) {
      el?.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

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

  // ── Place number ───────────────────────────────────────────
  const placeNumber = useCallback((num, targetKey) => {
    const key = targetKey ?? selected;
    if (!key || won) return;
    const [r, c] = key.split("-").map(Number);
    if (puzzle[r][c] !== 0) return; // clue — immutable

    if (noteMode) {
      // Only allow valid candidates
      const valid = getValidCandidates(board, r, c);
      if (!valid.has(num)) return; // silently ignore invalid note
      setNotes(prev => {
        const cur = new Set(prev[key] ?? []);
        cur.has(num) ? cur.delete(num) : cur.add(num);
        return { ...prev, [key]: cur };
      });
      return;
    }

    // Guard: cell already has a value — don't overwrite, must erase first
    if (board[r][c] !== 0) return;

    // Save history snapshot
    setHistory(h => [...h.slice(-29), {
      board: board.map(row => [...row]),
      notes: Object.fromEntries(Object.entries(notes).map(([k,v]) => [k, new Set(v)])),
    }]);

    const next = board.map(row => [...row]);
    next[r][c] = num;
    setBoard(next);

    // Mistake check
    if (num !== solution[r][c]) {
      setMistakes(m => m + 1);
    }

    // Prune notes: remove num from notes of peers in same row/col/box
    setNotes(prev => pruneNotes(prev, next, r, c, num));

    // Win check
    if (next.every((row, ri) => row.every((v, ci) => v === solution[ri][ci]))) {
      setWon(true);
      setTimerOn(false);
    }
  }, [selected, board, puzzle, solution, notes, noteMode, won]);

  // ── Erase ──────────────────────────────────────────────────
  const handleErase = useCallback(() => {
    const key = selected;
    if (!key) return;
    const [r, c] = key.split("-").map(Number);
    if (puzzle[r][c] !== 0) return;
    if (board[r][c] === 0 && !(notes[key]?.size)) return;
    setHistory(h => [...h.slice(-29), {
      board: board.map(row => [...row]),
      notes: Object.fromEntries(Object.entries(notes).map(([k,v]) => [k, new Set(v)])),
    }]);
    const next = board.map(row => [...row]);
    next[r][c] = 0;
    setBoard(next);
    setNotes(prev => ({ ...prev, [key]: new Set() }));
  }, [selected, board, puzzle, notes]);

  // ── Hint: compute valid notes for ALL empty cells ──────────
  const handleHint = useCallback(() => {
    const allNotes = buildAllNotes(board);
    setNotes(prev => {
      const merged = { ...prev };
      for (const [key, cands] of Object.entries(allNotes)) {
        // Merge with existing notes
        merged[key] = new Set([...(merged[key] ?? []), ...cands]);
      }
      return merged;
    });
    setNoteMode(true); // switch to note view so player sees the hints
  }, [board]);

  // ── Undo ───────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setBoard(prev.board);
    setNotes(prev.notes);
    setHistory(h => h.slice(0, -1));
  }, [history]);

  // ── Cell click ─────────────────────────────────────────────
  const handleCellClick = useCallback((r, c) => {
    const key    = `${r}-${c}`;
    const isClue = puzzle[r][c] !== 0;
    const cellVal = board[r][c];

    if (stickyNum && selectedNum && !isClue && cellVal === 0) {
      placeNumber(selectedNum, key);
      setSelected(key);
      return;
    }

    setSelected(key);

    // Tapping a filled cell → highlight its number
    if (cellVal !== 0) {
      setSelectedNum(cellVal);
      setStickyNum(false);
      return;
    }

    // Empty cell + a number selected → place it
    if (selectedNum && !isClue && !stickyNum && cellVal === 0) {
      placeNumber(selectedNum, key);
    }
  }, [puzzle, board, selectedNum, stickyNum, placeNumber]);

  // ── Num pad short tap ──────────────────────────────────────
  const handleNumTap = useCallback((num) => {
    // If a non-clue empty cell is selected → place immediately
    if (selected) {
      const [r, c] = selected.split("-").map(Number);
      if (puzzle[r][c] === 0 && board[r][c] === 0) {
        placeNumber(num, selected);
        setSelectedNum(num);
        return;
      }
    }
    // Otherwise just highlight
    setSelectedNum(prev => prev === num ? null : num);
    setStickyNum(false);
  }, [selected, puzzle, board, placeNumber]);

  // ── Num pad long press → sticky ────────────────────────────
  const handleNumLongPress = useCallback((num) => {
    setStickyNum(true);
    setSelectedNum(num);
    setSelected(null);
  }, []);

  // ── Keyboard ───────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (!difficulty) return;
      if (e.key >= "1" && e.key <= "9") {
        const n = Number(e.key);
        if (selected) {
          const [r, c] = selected.split("-").map(Number);
          if (puzzle[r][c] === 0 && board[r][c] === 0) placeNumber(n, selected);
        }
        setSelectedNum(prev => prev === n ? null : n);
      }
      if (e.key === "Backspace" || e.key === "Delete") handleErase();
      if (e.key.toLowerCase() === "n") setNoteMode(m => !m);
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo(); }
      const moves = { ArrowUp:[-1,0], ArrowDown:[1,0], ArrowLeft:[0,-1], ArrowRight:[0,1] };
      if (moves[e.key] && selected) {
        e.preventDefault();
        const [r, c] = selected.split("-").map(Number);
        const [dr, dc] = moves[e.key];
        setSelected(`${Math.max(0,Math.min(8,r+dr))}-${Math.max(0,Math.min(8,c+dc))}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [difficulty, selected, puzzle, board, placeNumber, handleErase, undo]);

  // ── Highlights ─────────────────────────────────────────────
  const getHL = useCallback((r, c) => {
    if (!board) return {};
    const [sr, sc] = selected ? selected.split("-").map(Number) : [-1,-1];
    const selVal   = (sr >= 0 && board[sr][sc]) ? board[sr][sc] : null;
    const hlNum    = stickyNum ? selectedNum : (selectedNum ?? selVal);
    return {
      isSelected:      selected === `${r}-${c}`,
      isHighlightRow:  sr >= 0 && r === sr,
      isHighlightCol:  sc >= 0 && c === sc,
      isHighlightBox:  sr >= 0 && Math.floor(r/3) === Math.floor(sr/3) && Math.floor(c/3) === Math.floor(sc/3),
      isHighlightNum:  !!(hlNum && board[r][c] === hlNum),
    };
  }, [selected, selectedNum, board, stickyNum]);

  const mins   = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs   = String(elapsed % 60).padStart(2, "0");
  const counts = board ? countDigits(board) : {};
  const conflicts = board ? getConflicts(board) : new Set();

  const diffColor  = { easy: "text-emerald-400", medium: "text-amber-400", hard: "text-red-400" };
  const diffLabel  = { easy: "Easy", medium: "Medium", hard: "Nightmare" };

  if (!difficulty) return <DifficultyPicker onStart={start} />;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-[#080c10] text-slate-100
                  ${fullscreen
                    ? "fixed inset-0 z-[999] overflow-y-auto"
                    : "w-full max-w-sm mx-auto pb-16"
                  }`}
    >
      {/* ── Status bar ── */}
      <div className="flex items-center justify-between px-3 py-2 shrink-0">
        <div className="flex items-center gap-3">
          <span className={`font-mono font-bold text-[13px] ${diffColor[difficulty]}`}>
            {diffLabel[difficulty]}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] text-slate-400">
            Mistake:{" "}
            <span className={mistakes > 2 ? "text-red-400 font-bold" : "text-slate-300"}>
              {mistakes}/3
            </span>
          </span>
          <span className="font-mono text-[12px] text-slate-300 tabular-nums">{mins}:{secs}</span>

          {/* Fullscreen toggle */}
          <button onClick={toggleFullscreen}
            className="font-mono text-[16px] text-slate-500 hover:text-cyan-400
                       transition-colors leading-none">
            {fullscreen ? "⛶" : "⛶"}
          </button>

          <button onClick={() => { setTimerOn(false); setDifficulty(null); }}
            className="font-mono text-[13px] text-slate-600 hover:text-red-400 transition-colors">
            ✕
          </button>
        </div>
      </div>

      {/* ── Win banner ── */}
      {won && (
        <div className="mx-3 mb-3 bg-emerald-400/15 border border-emerald-400/30 rounded-xl
                        p-4 text-center shrink-0">
          <p className="font-display font-extrabold text-emerald-400 text-xl mb-1">🎉 Solved!</p>
          <p className="font-mono text-[12px] text-slate-500">{mins}:{secs} · {mistakes} mistake{mistakes !== 1 ? "s" : ""}</p>
          <button onClick={() => start(difficulty)}
            className="mt-2 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[12px]
                       tracking-widest px-6 py-2 rounded-sm transition-all duration-200">
            New Puzzle
          </button>
        </div>
      )}

      {/* ── Sticky num banner ── */}
      {stickyNum && selectedNum && !won && (
        <div className="mx-3 mb-2 flex items-center justify-between bg-blue-500/10
                        border border-blue-500/25 rounded-lg px-3 py-2 shrink-0">
          <span className="font-mono text-[11px] text-blue-400">
            Tap any empty cell to place <strong className="text-white">{selectedNum}</strong>
          </span>
          <button onClick={() => { setStickyNum(false); setSelectedNum(null); }}
            className="font-mono text-[12px] text-slate-500 hover:text-red-400 ml-3">✕</button>
        </div>
      )}

      {/* ── Grid ── */}
      <div className="px-2 shrink-0">
        <div className="border-2 border-cyan-500/40 rounded-xl overflow-hidden">
          <div className="grid" style={{ gridTemplateColumns: "repeat(9, minmax(0, 1fr))" }}>
            {board.map((row, r) =>
              row.map((val, c) => {
                const hl = getHL(r, c);
                return (
                  <SudokuCell key={`${r}-${c}`}
                    r={r} c={c} val={val}
                    puzzle={puzzle}
                    solution={solution}
                    selectedNum={selectedNum}
                    {...hl}
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
      </div>

      {/* ── Number pad ── */}
      <div className="px-2 mt-3 shrink-0">
        <div className="bg-[#0d1117] border border-cyan-500/10 rounded-2xl p-3">
          <NumPad
            selectedNum={selectedNum}
            onNumTap={handleNumTap}
            onNumLongPress={handleNumLongPress}
            onErase={handleErase}
            onHint={handleHint}
            onToggleNote={() => setNoteMode(m => !m)}
            noteMode={noteMode}
            counts={counts}
          />
        </div>
      </div>

      {/* ── Undo / New ── */}
      <div className="flex gap-2 px-2 mt-2 shrink-0">
        <button onClick={undo} disabled={!history.length}
          className="flex-1 font-mono text-[12px] text-slate-500 border border-cyan-500/10
                     rounded-xl py-2.5 hover:border-cyan-400 hover:text-cyan-400
                     transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed
                     tracking-widest">
          ↩ Undo
        </button>
        <button onClick={() => start(difficulty)}
          className="flex-1 font-mono text-[12px] text-slate-500 border border-cyan-500/10
                     rounded-xl py-2.5 hover:border-cyan-400 hover:text-cyan-400
                     transition-all duration-200 tracking-widest">
          ↺ New
        </button>
      </div>

      <p className="font-mono text-[9px] text-slate-700 text-center mt-2 px-2 shrink-0">
        Tap cell · Tap number to place · Long-press number for sticky · ✏️ Notes · 💡 Auto-hints
      </p>
    </div>
  );
}
