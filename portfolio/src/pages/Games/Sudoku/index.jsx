// src/pages/Games/Sudoku/index.jsx
import { useState, useCallback, useEffect } from "react";
import { generatePuzzle, getConflicts } from "./sudokuLogic";

export default function Sudoku() {
  const [difficulty, setDifficulty] = useState(null);
  const [puzzle,     setPuzzle]     = useState(null);
  const [solution,   setSolution]   = useState(null);
  const [board,      setBoard]      = useState(null);   // user's working board
  const [selected,   setSelected]   = useState(null);   // "r-c"
  const [notes,      setNotes]      = useState({});     // { "r-c": Set }
  const [noteMode,   setNoteMode]   = useState(false);
  const [mistakes,   setMistakes]   = useState(0);
  const [won,        setWon]        = useState(false);
  const [elapsed,    setElapsed]    = useState(0);
  const [timerOn,    setTimerOn]    = useState(false);

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
    setNotes({});
    setNoteMode(false);
    setMistakes(0);
    setWon(false);
    setElapsed(0);
    setTimerOn(true);
  };

  const conflicts = board ? getConflicts(board) : new Set();

  const placeNum = useCallback((num) => {
    if (!selected || won) return;
    const [r, c] = selected.split("-").map(Number);
    if (puzzle[r][c] !== 0) return; // clue cell — immutable

    if (noteMode) {
      setNotes(prev => {
        const key    = selected;
        const cur    = new Set(prev[key]);
        cur.has(num) ? cur.delete(num) : cur.add(num);
        return { ...prev, [key]: cur };
      });
      return;
    }

    const next = board.map(row => [...row]);
    next[r][c] = next[r][c] === num ? 0 : num;
    setBoard(next);

    // Check mistake
    if (num !== 0 && num !== solution[r][c]) {
      setMistakes(m => m + 1);
    }

    // Clear notes for this cell
    setNotes(prev => ({ ...prev, [selected]: new Set() }));

    // Win check
    const solved = next.every((row, ri) =>
      row.every((val, ci) => val === solution[ri][ci])
    );
    if (solved) { setWon(true); setTimerOn(false); }
  }, [selected, board, puzzle, solution, noteMode, won]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (!selected) return;
      if (e.key >= "1" && e.key <= "9") placeNum(Number(e.key));
      if (e.key === "Backspace" || e.key === "0") placeNum(0);
      if (e.key === "n" || e.key === "N") setNoteMode(m => !m);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, placeNum]);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");

  const hint = () => {
    if (!selected || won) return;
    const [r, c] = selected.split("-").map(Number);
    if (puzzle[r][c] !== 0) return;
    const next = board.map(row => [...row]);
    next[r][c] = solution[r][c];
    setBoard(next);
    setMistakes(m => m + 1); // penalise hint
  };

  // Difficulty picker
  if (!difficulty) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="text-5xl mb-2">🔢</div>
      <h1 className="font-display text-[2rem] font-extrabold text-slate-100">Sudoku</h1>
      <p className="font-mono text-[13px] text-slate-500 text-center max-w-sm">
        Fill the 9×9 grid so every row, column, and 3×3 box contains digits 1–9.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mt-2">
        {[
          { key: "easy",   label: "Easy",   clues: "36 clues", cls: "border-emerald-500/20 hover:border-emerald-400" },
          { key: "medium", label: "Medium", clues: "27 clues", cls: "border-amber-500/20   hover:border-amber-400"   },
          { key: "hard",   label: "Hard",   clues: "20 clues", cls: "border-red-500/20     hover:border-red-400"     },
        ].map(({ key, label, clues, cls }) => (
          <button key={key} onClick={() => start(key)}
            className={`flex flex-col items-center gap-2 bg-[#141c26] border rounded-xl p-6
                        transition-all duration-200 hover:-translate-y-1 ${cls}`}>
            <span className="font-display font-bold text-slate-100 text-[1.1rem]">{label}</span>
            <span className="font-mono text-[11px] text-slate-500">{clues}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const selectedNum = selected
    ? board[+selected.split("-")[0]][+selected.split("-")[1]]
    : 0;

  return (
    <div className="flex flex-col items-center gap-4 pb-16">

      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🔢</span>
          <h1 className="font-display text-[1.3rem] font-extrabold text-slate-100">Sudoku</h1>
          <span className={`font-mono text-[10px] border px-2 py-0.5 rounded-sm tracking-wide
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

      {/* Stats */}
      <div className="flex gap-3 w-full max-w-md justify-center flex-wrap">
        <div className="flex items-center gap-2 bg-[#141c26] border border-cyan-500/10 rounded-lg px-4 py-2">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-widest">Time</span>
          <span className="font-mono font-bold text-cyan-400 tabular-nums">{mins}:{secs}</span>
        </div>
        <div className="flex items-center gap-2 bg-[#141c26] border border-cyan-500/10 rounded-lg px-4 py-2">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-widest">Mistakes</span>
          <span className={`font-mono font-bold tabular-nums ${mistakes > 2 ? "text-red-400" : "text-cyan-400"}`}>
            {mistakes}
          </span>
        </div>
        <button onClick={hint}
          className="flex items-center gap-2 bg-[#141c26] border border-cyan-500/10 rounded-lg
                     px-4 py-2 hover:border-cyan-400 transition-all duration-200">
          <span className="font-mono text-[11px] text-slate-500 uppercase tracking-widest">💡 Hint</span>
        </button>
      </div>

      {/* Win banner */}
      {won && (
        <div className="w-full max-w-md bg-emerald-400/10 border border-emerald-400/30 rounded-lg
                        p-4 text-center">
          <p className="font-display font-bold text-emerald-400 text-lg">🎉 Puzzle Solved!</p>
          <p className="font-mono text-[12px] text-slate-500 mt-1">
            Time: {mins}:{secs} · Mistakes: {mistakes}
          </p>
          <button onClick={() => start(difficulty)}
            className="mt-3 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[12px]
                       tracking-widest px-6 py-2 rounded-sm transition-all duration-200">
            New Puzzle
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-9 border-2 border-cyan-500/30 rounded-lg overflow-hidden w-full max-w-md">
        {board.map((row, r) =>
          row.map((val, c) => {
            const key       = `${r}-${c}`;
            const isClue    = puzzle[r][c] !== 0;
            const isSelected = selected === key;
            const isSameNum  = !isSelected && val !== 0 && val === selectedNum;
            const isConflict = conflicts.has(key);
            const isHighlight = selected && (
              +selected.split("-")[0] === r ||
              +selected.split("-")[1] === c ||
              (Math.floor(r/3) === Math.floor(+selected.split("-")[0]/3) &&
               Math.floor(c/3) === Math.floor(+selected.split("-")[1]/3))
            );
            const cellNotes  = notes[key] ? [...notes[key]] : [];
            const borderR    = (c + 1) % 3 === 0 && c !== 8 ? "border-r-2 border-r-cyan-500/30" : "border-r border-r-cyan-500/10";
            const borderB    = (r + 1) % 3 === 0 && r !== 8 ? "border-b-2 border-b-cyan-500/30" : "border-b border-b-cyan-500/10";

            return (
              <div key={key}
                onClick={() => !isClue && setSelected(key)}
                className={`
                  relative flex items-center justify-center
                  aspect-square cursor-pointer text-[0.9rem] font-display font-bold
                  transition-colors duration-100 select-none
                  ${borderR} ${borderB}
                  ${isSelected   ? "bg-cyan-400/20"  : ""}
                  ${isSameNum && !isSelected ? "bg-cyan-400/8" : ""}
                  ${isHighlight && !isSelected && !isSameNum ? "bg-[#141c26]" : ""}
                  ${!isHighlight && !isSelected && !isSameNum ? "bg-[#0d1117]" : ""}
                  ${isClue       ? "text-slate-300"  : ""}
                  ${!isClue && !isConflict && val ? "text-cyan-400" : ""}
                  ${isConflict   ? "text-red-400 bg-red-400/10" : ""}
                `}
              >
                {val !== 0
                  ? val
                  : cellNotes.length > 0
                  ? (
                    <div className="grid grid-cols-3 w-full h-full p-0.5">
                      {[1,2,3,4,5,6,7,8,9].map(n => (
                        <span key={n} className={`flex items-center justify-center text-[0.45rem]
                                                  ${cellNotes.includes(n) ? "text-cyan-400" : "text-transparent"}`}>
                          {n}
                        </span>
                      ))}
                    </div>
                  )
                  : ""
                }
              </div>
            );
          })
        )}
      </div>

      {/* Number pad */}
      <div className="flex flex-col gap-2 w-full max-w-md">

        {/* Note mode toggle */}
        <div className="flex items-center justify-between px-1">
          <button onClick={() => setNoteMode(m => !m)}
            className={`flex items-center gap-2 font-mono text-[11px] tracking-widest
                        px-4 py-2 rounded-sm border transition-all duration-200
                        ${noteMode
                          ? "bg-cyan-400 text-black border-cyan-400"
                          : "text-slate-500 border-cyan-500/15 hover:border-cyan-400 hover:text-cyan-400"
                        }`}>
            ✏️ Notes {noteMode ? "ON" : "OFF"}
          </button>
          <button onClick={() => start(difficulty)}
            className="font-mono text-[11px] text-slate-500 border border-cyan-500/15
                       px-4 py-2 rounded-sm hover:border-cyan-400 hover:text-cyan-400
                       transition-all duration-200 tracking-widest">
            ↺ New Puzzle
          </button>
        </div>

        {/* Digits */}
        <div className="grid grid-cols-9 gap-1.5">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} onClick={() => placeNum(n)}
              className="aspect-square flex items-center justify-center font-display font-bold
                         text-[1rem] bg-[#141c26] border border-cyan-500/15 rounded-lg
                         text-slate-300 hover:border-cyan-400 hover:text-cyan-400
                         active:scale-95 transition-all duration-150">
              {n}
            </button>
          ))}
        </div>

        {/* Erase */}
        <button onClick={() => placeNum(0)}
          className="w-full py-2 font-mono text-[12px] text-slate-500 border border-cyan-500/10
                     rounded-sm hover:border-cyan-400 hover:text-cyan-400 transition-all duration-200
                     tracking-widest">
          ⌫ Erase
        </button>
      </div>

      <p className="font-mono text-[10px] text-slate-700 text-center">
        Click a cell → tap a number · N = toggle notes · 💡 = hint (counts as mistake)
      </p>
    </div>
  );
}
