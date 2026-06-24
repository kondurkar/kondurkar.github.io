// src/pages/Games/Sudoku/index.jsx
import { useState, useCallback, useEffect, useRef } from "react";
import {
  generatePuzzle, getConflicts,
  getValidCandidates, buildAllNotes, pruneNotes,
} from "./sudokuLogic";

// ── Config ───────────────────────────────────────────────────
const DIGITS = [1,2,3,4,5,6,7,8,9];

// ── CONFIGURABLE DIFFICULTY ─────────────────────────────────
// clues: must match sudokuLogic.js CLUES values
// hints: 99 = unlimited, 0 = none
const DIFF_CONFIG = {
  easy:   { label: "Easy",      clues: 46, autoNotes: true,  hints: 99, color: "emerald" },
  medium: { label: "Medium",    clues: 36, autoNotes: false, hints: 3,  color: "amber"   },
  hard:   { label: "Nightmare", clues: 26, autoNotes: false, hints: 0,  color: "red"     },
};

const COLOR = {
  emerald: { text: "text-emerald-400", border: "border-emerald-500/30", hover: "hover:border-emerald-400", bg: "bg-emerald-400/10" },
  amber:   { text: "text-amber-400",   border: "border-amber-500/30",   hover: "hover:border-amber-400",   bg: "bg-amber-400/10"   },
  red:     { text: "text-red-400",     border: "border-red-500/30",     hover: "hover:border-red-400",     bg: "bg-red-400/10"     },
};

function countDigits(board) {
  const counts = {};
  DIGITS.forEach(d => (counts[d] = 0));
  board.forEach(row => row.forEach(v => { if (v) counts[v]++; }));
  return counts;
}

// Next available number after one is filled
function nextAvailableNum(counts, currentNum) {
  // Search forward from current+1, wrapping around
  for (let offset = 1; offset <= 9; offset++) {
    const n = ((currentNum - 1 + offset) % 9) + 1;
    if (counts[n] < 9) return n;
  }
  return null; // all filled (won)
}

// ── localStorage record ──────────────────────────────────────
function loadRecord() {
  try {
    return JSON.parse(localStorage.getItem("sudoku-record") || "{}");
  } catch { return {}; }
}
function saveRecord(rec) {
  localStorage.setItem("sudoku-record", JSON.stringify(rec));
}
function updateRecord(diff, outcome) { // outcome: "win" | "loss"
  const rec = loadRecord();
  if (!rec[diff]) rec[diff] = { wins: 0, losses: 0 };
  rec[diff][outcome === "win" ? "wins" : "losses"]++;
  saveRecord(rec);
  return rec;
}

// ── Difficulty picker ────────────────────────────────────────
function DifficultyPicker({ onStart }) {
  const record = loadRecord();
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔢</div>
        <h1 className="font-display text-[2.5rem] font-extrabold text-slate-100 mb-2">Sudoku</h1>
        <p className="font-mono text-[13px] text-slate-500 text-center max-w-xs">
          Fill every row, column and 3×3 box with digits 1–9.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[700px]">
        {Object.entries(DIFF_CONFIG).map(([key, cfg]) => {
          const col = COLOR[cfg.color];
          const rec = record[key] ?? { wins: 0, losses: 0 };
          return (
            <button key={key} onClick={() => onStart(key)}
              className={`flex flex-col items-center gap-3 bg-[#141c26] border rounded-2xl p-6
                          transition-all duration-200 hover:-translate-y-1
                          hover:shadow-[0_0_24px_rgba(0,200,255,0.1)]
                          ${col.border} ${col.hover}`}>
              <span className={`font-display font-extrabold text-[1.3rem] ${col.text}`}>{cfg.label}</span>
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-mono text-[11px] text-slate-500">{cfg.clues} clues revealed</span>
                {cfg.autoNotes && <span className="font-mono text-[10px] text-cyan-400">Auto notes ✓</span>}
                {cfg.hints > 0 && cfg.hints < 99 && <span className="font-mono text-[10px] text-amber-400">{cfg.hints} hints</span>}
                {cfg.hints === 0 && <span className="font-mono text-[10px] text-red-400">No hints</span>}
              </div>
              {(rec.wins > 0 || rec.losses > 0) && (
                <div className="flex gap-3 font-mono text-[11px]">
                  <span className="text-emerald-400">{rec.wins}W</span>
                  <span className="text-red-400">{rec.losses}L</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Single cell ──────────────────────────────────────────────
function SudokuCell({ r, c, val, puzzle, solution, isSelected, isHighlightRow,
  isHighlightCol, isHighlightBox, isHighlightNum, noteSet, isSolved,
  selectedNum, onClick }) {

  const isClue    = puzzle[r][c] !== 0;
  const notes     = noteSet ? [...noteSet].sort((a,b) => a-b) : [];
  const showNotes = !val && notes.length > 0;
  const isWrong   = !isClue && val !== 0 && val !== solution[r][c];

  const borderR = (c + 1) % 3 === 0 && c !== 8 ? "border-r-[2px] border-r-cyan-500/50" : "border-r border-r-[#1e2a3a]";
  const borderB = (r + 1) % 3 === 0 && r !== 8 ? "border-b-[2px] border-b-cyan-500/50" : "border-b border-b-[#1e2a3a]";

  let bg = "bg-[#0f1923]";
  if (isSelected)          bg = "bg-[#1e3a5f]";
  else if (isWrong)        bg = "bg-red-500/10";
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
            const inNote = notes.includes(n);
            const isHL   = inNote && selectedNum === n;
            return (
              <span key={n}
                className={`flex items-center justify-center font-mono leading-none
                            text-[clamp(10px,2vw,13px)] transition-colors duration-100
                            ${!inNote        ? "text-transparent"         : ""}
                            ${inNote && isHL ? "text-white font-bold bg-[#0068ff]"     : ""}
                            ${inNote && !isHL? "text-cyan-400 opacity-70" : ""}`}>
                {n}
              </span>
            );
          })}
        </div>
      ) : val ? (
        <span className={`font-display font-bold select-none text-[clamp(14px,3.5vw,24px)] leading-none
                          ${isWrong                                          ? "text-red-400"     : ""}
                          ${!isWrong && isClue                               ? "text-slate-200"   : ""}
                          ${!isWrong && !isClue && isSolved                  ? "text-emerald-400" : ""}
                          ${!isWrong && !isClue && !isSolved                 ? "text-blue-400"    : ""}`}>
          {val}
        </span>
      ) : null}
      {isSelected && <div className="absolute inset-0 ring-2 ring-inset ring-cyan-400 pointer-events-none z-10" />}
    </div>
  );
}

// ── Number pad ───────────────────────────────────────────────
function NumPad({ selectedNum, onNumTap, onNumLongPress, onErase, onHint,
  onAdvancedNotes, onToggleNote, noteMode, counts, hintsLeft, diffKey }) {

  const timerRef = useRef({});
  const firedRef = useRef({});
  const cfg      = DIFF_CONFIG[diffKey];

  const startPress = (n) => {
    firedRef.current[n] = false;
    timerRef.current[n] = setTimeout(() => {
      firedRef.current[n] = true;
      onNumLongPress(n);
    }, 450);
  };
  const endPress = (n) => {
    clearTimeout(timerRef.current[n]);
    if (!firedRef.current[n]) onNumTap(n);
  };

  // Note mode changes digit colour to amber
  const digitActive  = (n) => selectedNum === n;
  const digitFull    = (n) => counts[n] >= 9;

  return (
    <div className="flex flex-col gap-2.5 w-full">

      {/* Tool row — 4 tools */}
      <div className="grid grid-cols-4 gap-1.5">

        {/* Erase */}
        <button onClick={onErase}
          className="flex flex-col items-center justify-center gap-0.5 bg-[#1a2535]
                     border border-cyan-500/15 rounded-xl py-2.5
                     hover:border-cyan-400 active:scale-95 transition-all duration-150">
          <span className="text-lg">⌫</span>
          <span className="font-mono text-[8px] text-slate-500 tracking-widest">Erase</span>
        </button>

        {/* Notes toggle — amber when ON */}
        <button onClick={onToggleNote}
          className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-2.5
                      border transition-all duration-150 active:scale-95
                      ${noteMode
                        ? "bg-amber-400/15 border-amber-400 text-amber-400"
                        : "bg-[#1a2535] border-cyan-500/15 text-slate-400 hover:border-amber-400"}`}>
          <span className="text-lg">✏️</span>
          <span className="font-mono text-[8px] tracking-widest">
            Notes {noteMode ? "ON" : "OFF"}
          </span>
        </button>

        {/* Advanced Notes — fill all valid notes */}
        <button onClick={onAdvancedNotes}
          className="flex flex-col items-center justify-center gap-0.5 bg-cyan-400/8
                     border border-cyan-500/25 rounded-xl py-2.5 text-cyan-400
                     hover:bg-cyan-400/15 hover:border-cyan-400 active:scale-95
                     transition-all duration-150">
          <span className="text-lg">📝</span>
          <span className="font-mono text-[8px] tracking-widest">Adv Notes</span>
        </button>

        {/* Hint — direct number in cell */}
        <button onClick={onHint}
          disabled={cfg.hints === 0 || hintsLeft <= 0}
          className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-2.5
                      border transition-all duration-150 active:scale-95
                      disabled:opacity-25 disabled:cursor-not-allowed
                      ${cfg.hints === 0
                        ? "bg-[#1a2535] border-slate-700 text-slate-600"
                        : "bg-amber-400/10 border-amber-400/30 text-amber-400 hover:bg-amber-400/20 hover:border-amber-400"
                      }`}>
          <span className="text-lg">💡</span>
          <span className="font-mono text-[8px] tracking-widest">
            {cfg.hints === 99 ? "Hint" : cfg.hints === 0 ? "No hints" : `Hint (${hintsLeft})`}
          </span>
        </button>
      </div>

      {/* Digit grid */}
      <div className="grid grid-cols-9 gap-1">
        {DIGITS.map(n => {
          const full   = digitFull(n);
          const active = digitActive(n);
          return (
            <button key={n} disabled={full}
              onMouseDown={() => startPress(n)} onMouseUp={() => endPress(n)}
              onTouchStart={(e) => { e.preventDefault(); startPress(n); }}
              onTouchEnd={(e)   => { e.preventDefault(); endPress(n);   }}
              className={`aspect-square rounded-xl font-display font-extrabold select-none
                          text-[clamp(15px,3.5vw,26px)] transition-all duration-150
                          active:scale-90 flex items-center justify-center border
                          ${full
                            ? "opacity-10 cursor-not-allowed text-slate-600 bg-transparent border-transparent"
                            : active && noteMode
                            ? "bg-amber-500 text-white shadow-[0_0_14px_rgba(245,158,11,0.6)] border-amber-400"
                            : active && !noteMode
                            ? "bg-blue-500 text-white shadow-[0_0_14px_rgba(59,130,246,0.6)] border-blue-400"
                            : noteMode
                            ? "bg-[#1a2535] text-amber-300 border-amber-500/15 hover:bg-[#223045] hover:border-amber-500/30"
                            : "bg-[#1a2535] text-blue-300 border-cyan-500/10 hover:bg-[#223045] hover:border-cyan-500/30"
                          }`}>
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Game Over overlay ────────────────────────────────────────
function GameOverlay({ type, difficulty, mistakes, elapsed, record, onNewGame, onChangeMode }) {
  const mins = String(Math.floor(elapsed / 60)).padStart(2,"0");
  const secs = String(elapsed % 60).padStart(2,"0");
  const isWin = type === "win";
  const rec   = record[difficulty] ?? { wins: 0, losses: 0 };
  const cfg   = DIFF_CONFIG[difficulty];
  const col   = COLOR[cfg.color];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(8,12,16,0.92)", backdropFilter: "blur(8px)" }}>
      <div className="bg-[#0d1117] border border-cyan-500/20 rounded-2xl p-6 w-full max-w-xs text-center
                      shadow-[0_0_60px_rgba(0,200,255,0.08)]">
        <div className="text-4xl mb-3">{isWin ? "🎉" : "💀"}</div>
        <h2 className={`font-display text-[1.8rem] font-extrabold mb-1 ${isWin ? "text-emerald-400" : "text-red-400"}`}>
          {isWin ? "Solved!" : "Game Over"}
        </h2>
        <p className="font-mono text-[12px] text-slate-500 mb-4">
          {isWin ? `${mins}:${secs} · ${mistakes} error${mistakes !== 1 ? "s" : ""}` : `Puzzle abandoned with ${mistakes} error${mistakes !== 1 ? "s" : ""}`}
        </p>

        {/* Record */}
        <div className={`flex items-center justify-center gap-4 border rounded-lg py-3 mb-5 ${col.border} ${col.bg}`}>
          <div>
            <div className="font-display font-extrabold text-emerald-400 text-xl">{rec.wins}</div>
            <div className="font-mono text-[9px] text-slate-600 tracking-widest uppercase">Wins</div>
          </div>
          <div className={`font-mono text-[11px] font-bold ${col.text}`}>{cfg.label}</div>
          <div>
            <div className="font-display font-extrabold text-red-400 text-xl">{rec.losses}</div>
            <div className="font-mono text-[9px] text-slate-600 tracking-widest uppercase">Losses</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={onNewGame}
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[12px]
                       tracking-widest py-3 rounded-sm transition-all duration-200
                       hover:shadow-[0_0_20px_rgba(0,200,255,0.4)]">
            Play Again ({cfg.label})
          </button>
          <button onClick={onChangeMode}
            className="w-full border border-cyan-500/20 text-slate-400 font-mono text-[12px]
                       tracking-widest py-3 rounded-sm transition-all duration-200
                       hover:border-cyan-400 hover:text-cyan-400">
            Change Mode
          </button>
        </div>
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
  const [gameStatus,  setGameStatus]  = useState("idle"); // idle|playing|won|lost
  const [elapsed,     setElapsed]     = useState(0);
  const [timerOn,     setTimerOn]     = useState(false);
  const [history,     setHistory]     = useState([]);
  const [fullscreen,  setFullscreen]  = useState(false);
  const [hintsLeft,   setHintsLeft]   = useState(0);
  const [record,      setRecord]      = useState(loadRecord);
  const containerRef  = useRef(null);

  const cfg = difficulty ? DIFF_CONFIG[difficulty] : null;

  // Timer
  useEffect(() => {
    if (!timerOn) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [timerOn]);

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };
  useEffect(() => {
    const h = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const start = useCallback((diff) => {
    const diffCfg = DIFF_CONFIG[diff];
    const { puzzle: p, solution: s } = generatePuzzle(diff);
    const initNotes = diffCfg.autoNotes ? buildAllNotes(p) : {};

    setDifficulty(diff);
    setPuzzle(p.map(r => [...r]));
    setSolution(s);
    setBoard(p.map(r => [...r]));
    setSelected(null);
    setSelectedNum(null);
    setStickyNum(false);
    setNotes(initNotes);
    setNoteMode(false);
    setMistakes(0);
    setGameStatus("playing");
    setElapsed(0);
    setTimerOn(true);
    setHistory([]);
    setHintsLeft(diffCfg.hints === 99 ? 99 : diffCfg.hints);
  }, []);

  const changeMode = useCallback(() => {
    setTimerOn(false);
    setGameStatus("idle");
    setDifficulty(null);
    setBoard(null);
  }, []);

  // ── Place number ────────────────────────────────────────────
  const placeNumber = useCallback((num, targetKey) => {
    const key = targetKey ?? selected;
    if (!key || gameStatus !== "playing") return;
    const [r, c] = key.split("-").map(Number);
    if (puzzle[r][c] !== 0) return;

    if (noteMode) {
      const valid = getValidCandidates(board, r, c);
      if (!valid.has(num)) return;
      setNotes(prev => {
        const cur = new Set(prev[key] ?? []);
        cur.has(num) ? cur.delete(num) : cur.add(num);
        return { ...prev, [key]: cur };
      });
      return;
    }

    if (board[r][c] !== 0) return; // no overwrite

    setHistory(h => [...h.slice(-29), {
      board: board.map(row => [...row]),
      notes: Object.fromEntries(Object.entries(notes).map(([k,v]) => [k, new Set(v)])),
    }]);

    const next = board.map(row => [...row]);
    next[r][c] = num;
    setBoard(next);

    // Mistake: wrong answer permanently increments counter — cannot be undone by erasing
    if (num !== solution[r][c]) {
      setMistakes(m => m + 1);
    }

    const prunedNotes = pruneNotes(notes, next, r, c, num);
    setNotes(prunedNotes);

    // Win check
    if (next.every((row, ri) => row.every((v, ci) => v === solution[ri][ci]))) {
      setTimerOn(false);
      setGameStatus("won");
      const newRec = updateRecord(difficulty, "win");
      setRecord(newRec);
      return;
    }

    // Auto-advance selectedNum if digit is fully placed
    const newCounts = countDigits(next);
    if (selectedNum && newCounts[selectedNum] >= 9) {
      const next_num = nextAvailableNum(newCounts, selectedNum);
      setSelectedNum(next_num);
      if (stickyNum) setStickyNum(!!next_num);
    }
  }, [selected, board, puzzle, solution, notes, noteMode, gameStatus,
      mistakes, cfg, difficulty, selectedNum, stickyNum]);

  // ── Erase ───────────────────────────────────────────────────
  const handleErase = useCallback(() => {
    if (!selected || gameStatus !== "playing") return;
    const [r, c] = selected.split("-").map(Number);
    if (puzzle[r][c] !== 0) return;
    if (board[r][c] === 0 && !notes[selected]?.size) return;
    setHistory(h => [...h.slice(-29), {
      board: board.map(row => [...row]),
      notes: Object.fromEntries(Object.entries(notes).map(([k,v]) => [k, new Set(v)])),
    }]);
    const next = board.map(row => [...row]);
    next[r][c] = 0;
    setBoard(next);
    setNotes(prev => ({ ...prev, [selected]: new Set() }));
  }, [selected, board, puzzle, notes, gameStatus, mistakes]);

  // ── Hint: place correct value directly ──────────────────────
  const handleHint = useCallback(() => {
    if (gameStatus !== "playing") return;
    if (hintsLeft <= 0 && cfg.hints !== 99) return;

    // Find target cell: use selected if it's empty, otherwise find first wrong/empty cell
    let hintKey = null;
    if (selected) {
      const [sr, sc] = selected.split("-").map(Number);
      if (puzzle[sr][sc] === 0 && board[sr][sc] === 0) {
        hintKey = selected;
      }
    }
    // If no valid selected cell, find first empty non-clue cell
    if (!hintKey) {
      outer: for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (puzzle[r][c] === 0 && board[r][c] === 0) {
            hintKey = `${r}-${c}`;
            break outer;
          }
        }
      }
    }
    if (!hintKey) return;

    const [r, c] = hintKey.split("-").map(Number);
    if (puzzle[r][c] !== 0 || board[r][c] !== 0) return;

    const correct = solution[r][c];
    setHistory(h => [...h.slice(-29), {
      board: board.map(row => [...row]),
      notes: Object.fromEntries(Object.entries(notes).map(([k,v]) => [k, new Set(v)])),
    }]);
    const next = board.map(row => [...row]);
    next[r][c] = correct;
    setBoard(next);
    setSelected(hintKey); // highlight the hinted cell
    setNotes(prev => pruneNotes({ ...prev, [hintKey]: new Set() }, next, r, c, correct));
    if (cfg.hints !== 99) setHintsLeft(h => h - 1);

    // Win check
    if (next.every((row, ri) => row.every((v, ci) => v === solution[ri][ci]))) {
      setTimerOn(false);
      setGameStatus("won");
      setRecord(updateRecord(difficulty, "win"));
    }

    // Auto-advance selectedNum
    const newCounts = countDigits(next);
    if (selectedNum && newCounts[selectedNum] >= 9) {
      setSelectedNum(nextAvailableNum(newCounts, selectedNum));
    }
  }, [selected, board, puzzle, solution, notes, gameStatus, hintsLeft,
      cfg, difficulty, mistakes, selectedNum]);

  // ── Advanced Notes: fill ALL valid notes ────────────────────
  const handleAdvancedNotes = useCallback(() => {
    if (gameStatus !== "playing") return;
    const allNotes = buildAllNotes(board);
    setNotes(allNotes);
    setNoteMode(true);
  }, [board, gameStatus]);

  // ── Undo ────────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setBoard(prev.board);
    setNotes(prev.notes);
    // mistakes intentionally NOT restored — errors are permanent
    setHistory(h => h.slice(0, -1));
  }, [history]);

  // ── Cell click ──────────────────────────────────────────────
  const handleCellClick = useCallback((r, c) => {
    if (gameStatus !== "playing") return;
    const key     = `${r}-${c}`;
    const isClue  = puzzle[r][c] !== 0;
    const cellVal = board[r][c];

    if (stickyNum && selectedNum && !isClue && cellVal === 0) {
      placeNumber(selectedNum, key);
      setSelected(key);
      return;
    }

    setSelected(key);

    if (cellVal !== 0) {
      setSelectedNum(cellVal);
      setStickyNum(false);
      return;
    }

    if (selectedNum && !isClue && !stickyNum && cellVal === 0) {
      placeNumber(selectedNum, key);
    }
  }, [puzzle, board, selectedNum, stickyNum, placeNumber, gameStatus]);

  // ── Num tap ─────────────────────────────────────────────────
  const handleNumTap = useCallback((num) => {
    if (selected) {
      const [r, c] = selected.split("-").map(Number);
      if (puzzle[r][c] === 0 && board[r][c] === 0) {
        placeNumber(num, selected);
        setSelectedNum(num);
        return;
      }
    }
    setSelectedNum(prev => prev === num ? null : num);
    setStickyNum(false);
  }, [selected, puzzle, board, placeNumber]);

  // ── Long press → sticky ─────────────────────────────────────
  const handleNumLongPress = useCallback((num) => {
    setStickyNum(true);
    setSelectedNum(num);
    setSelected(null);
  }, []);

  // ── Keyboard ────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (!difficulty || gameStatus !== "playing") return;
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
  }, [difficulty, gameStatus, selected, puzzle, board, placeNumber, handleErase, undo]);

  // ── Highlights ──────────────────────────────────────────────
  const getHL = useCallback((r, c) => {
    if (!board) return {};
    const [sr, sc] = selected ? selected.split("-").map(Number) : [-1,-1];
    const selVal   = sr >= 0 && board[sr][sc] ? board[sr][sc] : null;
    const hlNum    = stickyNum ? selectedNum : (selectedNum ?? selVal);
    return {
      isSelected:      selected === `${r}-${c}`,
      isHighlightRow:  sr >= 0 && r === sr,
      isHighlightCol:  sc >= 0 && c === sc,
      isHighlightBox:  sr >= 0 && Math.floor(r/3) === Math.floor(sr/3) && Math.floor(c/3) === Math.floor(sc/3),
      isHighlightNum:  !!(hlNum && board[r][c] === hlNum),
    };
  }, [selected, selectedNum, board, stickyNum]);

  const mins      = String(Math.floor(elapsed / 60)).padStart(2,"0");
  const secs      = String(elapsed % 60).padStart(2,"0");
  const counts    = board ? countDigits(board) : {};
  const conflicts = board ? getConflicts(board) : new Set();

  if (!difficulty || gameStatus === "idle") return <DifficultyPicker onStart={start} />;

  const diffCol = COLOR[cfg.color];

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col bg-[#080c10] text-slate-100
                  ${fullscreen ? "fixed inset-0 z-[999] overflow-y-auto" : "w-full max-w-[480px] mx-auto pb-8"}`}
    >
      {/* ── Status bar ── */}
      <div className="flex items-center justify-between px-3 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className={`font-mono font-bold text-[13px] ${diffCol.text}`}>{cfg.label}</span>
          {/* Record mini */}
          {(record[difficulty]?.wins > 0 || record[difficulty]?.losses > 0) && (
            <span className="font-mono text-[10px] text-slate-600">
              {record[difficulty]?.wins ?? 0}W/{record[difficulty]?.losses ?? 0}L
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] text-slate-400">
            Errors: <span className={mistakes > 4 ? "text-red-400 font-bold" : mistakes > 2 ? "text-amber-400" : "text-slate-300"}>
              {mistakes}
            </span>
          </span>
          <span className="font-mono text-[12px] text-slate-300 tabular-nums">{mins}:{secs}</span>
          <button onClick={toggleFullscreen}
            className="text-slate-500 hover:text-cyan-400 transition-colors text-[14px] leading-none">
            ⛶
          </button>
          <button onClick={changeMode}
            className="font-mono text-[11px] text-slate-600 hover:text-cyan-400 transition-colors">
            ⚙
          </button>
        </div>
      </div>

      {/* ── Sticky banner ── */}
      {stickyNum && selectedNum && gameStatus === "playing" && (
        <div className="mx-2 mb-1 flex items-center justify-between bg-blue-500/10
                        border border-blue-500/25 rounded-lg px-3 py-1.5 shrink-0">
          <span className="font-mono text-[10px] text-blue-400">
            Sticky: tap cells to place <strong className="text-white">{selectedNum}</strong>
          </span>
          <button onClick={() => { setStickyNum(false); setSelectedNum(null); }}
            className="text-slate-500 hover:text-red-400 ml-2 text-sm">✕</button>
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
                    puzzle={puzzle} solution={solution} selectedNum={selectedNum}
                    {...hl}
                    isConflict={conflicts.has(`${r}-${c}`)}
                    noteSet={notes[`${r}-${c}`]}
                    isSolved={gameStatus === "won"}
                    onClick={() => handleCellClick(r, c)}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Numpad ── */}
      <div className="px-2 mt-2 shrink-0">
        <div className="bg-[#0d1117] border border-cyan-500/10 rounded-2xl p-3">
          <NumPad
            selectedNum={selectedNum}
            onNumTap={handleNumTap}
            onNumLongPress={handleNumLongPress}
            onErase={handleErase}
            onHint={handleHint}
            onAdvancedNotes={handleAdvancedNotes}
            onToggleNote={() => setNoteMode(m => !m)}
            noteMode={noteMode}
            counts={counts}
            hintsLeft={hintsLeft}
            diffKey={difficulty}
          />
        </div>
      </div>

      {/* ── Undo / Change Mode ── */}
      <div className="flex gap-2 px-2 mt-2 shrink-0">
        <button onClick={undo} disabled={!history.length}
          className="flex-1 font-mono text-[11px] text-slate-500 border border-cyan-500/10
                     rounded-xl py-2 hover:border-cyan-400 hover:text-cyan-400
                     transition-all disabled:opacity-25 disabled:cursor-not-allowed tracking-widest">
          ↩ Undo
        </button>
        <button onClick={() => start(difficulty)}
          className="flex-1 font-mono text-[11px] text-slate-500 border border-cyan-500/10
                     rounded-xl py-2 hover:border-cyan-400 hover:text-cyan-400
                     transition-all tracking-widest">
          ↺ New
        </button>
        <button onClick={changeMode}
          className="flex-1 font-mono text-[11px] text-slate-500 border border-cyan-500/10
                     rounded-xl py-2 hover:border-cyan-400 hover:text-cyan-400
                     transition-all tracking-widest">
          ⚙ Mode
        </button>
      </div>

      {/* ── Win/Loss overlay ── */}
      {gameStatus === "won" && (
        <GameOverlay
          type={gameStatus === "won" ? "win" : "loss"}
          difficulty={difficulty}
          mistakes={mistakes}
          elapsed={elapsed}
          record={record}
          onNewGame={() => start(difficulty)}
          onChangeMode={changeMode}
        />
      )}
    </div>
  );
}