// src/pages/Games/Wordle/index.jsx
import { useState, useEffect, useCallback } from "react";
import { getRandomWord, isValidGuess } from "./words";

const ROWS    = 6;
const COLS    = 5;
const LETTERS = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

// Evaluate a guess against the target
function evaluate(guess, target) {
  const result  = Array(COLS).fill("absent");
  const tArr    = target.split("");
  const gArr    = guess.split("");
  const used    = Array(COLS).fill(false);

  // First pass — correct positions
  gArr.forEach((l, i) => {
    if (l === tArr[i]) { result[i] = "correct"; used[i] = true; }
  });
  // Second pass — present but wrong position
  gArr.forEach((l, i) => {
    if (result[i] === "correct") return;
    const j = tArr.findIndex((t, ti) => t === l && !used[ti]);
    if (j !== -1) { result[i] = "present"; used[j] = true; }
  });
  return result;
}

const STATE_COLORS = {
  correct: "bg-emerald-500  border-emerald-500  text-white",
  present: "bg-amber-500    border-amber-500    text-white",
  absent:  "bg-[#1a2535]    border-slate-700    text-slate-400",
  tbd:     "bg-transparent  border-cyan-500/30  text-slate-100",
  empty:   "bg-transparent  border-cyan-500/10  text-transparent",
};

const KEY_COLORS = {
  correct: "bg-emerald-500 text-white border-emerald-500",
  present: "bg-amber-500   text-white border-amber-500",
  absent:  "bg-[#1a2535]   text-slate-500 border-slate-700",
  unused:  "bg-[#141c26]   text-slate-300 border-cyan-500/15 hover:border-cyan-500/40",
};

function Cell({ letter, state, isActive }) {
  return (
    <div className={`w-full aspect-square flex items-center justify-center
                     font-display font-extrabold text-[1.4rem] border-2 rounded-lg
                     transition-all duration-300 select-none uppercase
                     ${STATE_COLORS[state] ?? STATE_COLORS.empty}
                     ${isActive && letter ? "scale-110" : "scale-100"}
                    `}>
      {letter}
    </div>
  );
}

function Key({ letter, state, onClick, wide }) {
  return (
    <button
      onClick={() => onClick(letter)}
      className={`flex items-center justify-center font-mono font-bold text-[13px]
                  border rounded-md transition-all duration-150 active:scale-95 select-none
                  ${wide ? "px-4 py-3 text-[11px]" : "w-9 h-12"}
                  ${KEY_COLORS[state] ?? KEY_COLORS.unused}`}
    >
      {letter}
    </button>
  );
}

export default function Wordle() {
  const [target,   setTarget]   = useState(() => getRandomWord());
  const [guesses,  setGuesses]  = useState([]); // array of { word, result[] }
  const [current,  setCurrent]  = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won,      setWon]      = useState(false);
  const [shake,    setShake]    = useState(false);
  const [message,  setMessage]  = useState("");
  const [hardMode, setHardMode] = useState(false);

  // Build keyboard state from guesses
  const keyStates = {};
  guesses.forEach(({ word, result }) => {
    word.split("").forEach((l, i) => {
      const prev = keyStates[l];
      const curr = result[i];
      if (prev === "correct") return;
      if (prev === "present" && curr !== "correct") return;
      keyStates[l] = curr;
    });
  });

  const showMessage = (msg, ms = 1800) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), ms);
  };

  const submitGuess = useCallback(() => {
    if (current.length !== COLS) { setShake(true); setTimeout(() => setShake(false), 500); showMessage("Not enough letters"); return; }
    if (!isValidGuess(current))  { setShake(true); setTimeout(() => setShake(false), 500); showMessage("Not in word list"); return; }

    const result  = evaluate(current, target);
    const newGuess = { word: current, result };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrent("");

    if (current === target) {
      const msgs = ["Genius!", "Magnificent!", "Impressive!", "Splendid!", "Great!", "Phew!"];
      showMessage(msgs[newGuesses.length - 1] ?? "Got it!", 3000);
      setWon(true);
      setGameOver(true);
    } else if (newGuesses.length >= ROWS) {
      showMessage(target, 4000);
      setGameOver(true);
    }
  }, [current, guesses, target]);

  const handleKey = useCallback((key) => {
    if (gameOver) return;
    if (key === "ENTER")     { submitGuess(); return; }
    if (key === "BACKSPACE") { setCurrent(c => c.slice(0, -1)); return; }
    if (/^[A-Z]$/.test(key) && current.length < COLS) setCurrent(c => c + key);
  }, [gameOver, current, submitGuess]);

  // Physical keyboard
  useEffect(() => {
    const onKey = (e) => handleKey(e.key.toUpperCase());
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleKey]);

  const newGame = () => {
    setTarget(getRandomWord());
    setGuesses([]);
    setCurrent("");
    setGameOver(false);
    setWon(false);
    setMessage("");
  };

  // Build grid rows
  const rows = Array.from({ length: ROWS }, (_, r) => {
    if (r < guesses.length) return guesses[r];
    if (r === guesses.length && !gameOver) {
      const letters = current.padEnd(COLS, " ").split("");
      return {
        word: current,
        result: letters.map((l, i) =>
          current[i] ? "tbd" : "empty"
        ),
        isCurrent: true,
      };
    }
    return { word: "     ", result: Array(COLS).fill("empty") };
  });

  return (
    <div className="flex flex-col items-center gap-5 pb-16">

      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🟩</span>
          <h1 className="font-display text-[1.4rem] font-extrabold text-slate-100">Wordle</h1>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="font-mono text-[10px] text-slate-500 tracking-widest">HARD</span>
            <div onClick={() => setHardMode(h => !h)}
              className={`w-8 h-4 rounded-full border transition-all duration-200 relative cursor-pointer
                          ${hardMode ? "bg-cyan-400 border-cyan-400" : "bg-[#1a2535] border-cyan-500/20"}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-200
                               ${hardMode ? "left-4" : "left-0.5"}`} />
            </div>
          </label>
          <button onClick={newGame}
            className="font-mono text-[12px] text-slate-500 border border-cyan-500/15
                       px-3 py-1.5 rounded-sm hover:border-cyan-400 hover:text-cyan-400
                       transition-all duration-200">
            ↺ New
          </button>
        </div>
      </div>

      {/* Toast message */}
      <div className={`font-mono text-[13px] px-4 py-2 rounded-sm border transition-all duration-300
                       ${message
                         ? "opacity-100 bg-[#141c26] border-cyan-500/20 text-cyan-400"
                         : "opacity-0 border-transparent"}`}>
        {message || "‎"}
      </div>

      {/* Grid */}
      <div className="grid gap-2 w-full max-w-[280px]"
           style={{ gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
        {rows.map((row, r) => (
          <div key={r}
            className={`grid gap-2 ${r === guesses.length && shake ? "animate-bounce" : ""}`}
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {Array.from({ length: COLS }, (_, c) => (
              <Cell
                key={c}
                letter={row.word[c]?.trim() || ""}
                state={row.result[c]}
                isActive={row.isCurrent}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Win/lose actions */}
      {gameOver && (
        <button onClick={newGame}
          className="bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[12px]
                     tracking-widest px-8 py-3 rounded-sm transition-all duration-200
                     hover:shadow-[0_0_20px_rgba(0,200,255,0.4)]">
          {won ? "Play Again 🎉" : "Try Again"}
        </button>
      )}

      {/* Keyboard */}
      <div className="flex flex-col items-center gap-1.5 w-full  max-w-[396px]">
        {["QWERTYUIOP", "ASDFGHJKL", "ENTERXCVBNMBACKSPACE"].map((row, ri) => (
          <div key={ri} className="flex gap-1 justify-center flex-wrap">
            {(ri === 2
              ? ["ENTER", ...row.replace("ENTER","").replace("BACKSPACE","").split(""), "BACKSPACE"]
              : row.split("")
            ).map(key => (
              <Key
                key={key}
                letter={key === "BACKSPACE" ? "⌫" : key}
                state={keyStates[key] ?? "unused"}
                wide={key === "ENTER" || key === "BACKSPACE"}
                onClick={() => handleKey(key)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap justify-center">
        {[
          { color: "bg-emerald-500", label: "Correct spot"   },
          { color: "bg-amber-500",   label: "Wrong spot"     },
          { color: "bg-[#1a2535]",   label: "Not in word"    },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded ${color}`} />
            <span className="font-mono text-[10px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
