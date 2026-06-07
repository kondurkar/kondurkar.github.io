// src/pages/Games/Hangman/index.jsx
import { useState, useEffect, useCallback } from "react";
import { getWord, CATEGORIES } from "./words";
import HangmanFigure from "./HangmanFigure";

const MAX_WRONG = 6;
const ALPHABET  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Hangman() {
  const [category, setCategory] = useState("frontend");
  const [word,     setWord]     = useState(() => getWord("frontend"));
  const [guessed,  setGuessed]  = useState(new Set());
  const [scores,   setScores]   = useState({ wins: 0, losses: 0 });

  const wrong   = [...guessed].filter(l => !word.includes(l));
  const correct = [...guessed].filter(l =>  word.includes(l));
  const won     = word.split("").every(l => guessed.has(l));
  const lost    = wrong.length >= MAX_WRONG;
  const over    = won || lost;

  // Track score on game over
  useEffect(() => {
    if (!over) return;
    setScores(s => ({
      wins:   won  ? s.wins   + 1 : s.wins,
      losses: lost ? s.losses + 1 : s.losses,
    }));
  }, [over]);

  const guess = useCallback((letter) => {
    if (over || guessed.has(letter)) return;
    setGuessed(g => new Set([...g, letter]));
  }, [over, guessed]);

  // Physical keyboard
  useEffect(() => {
    const onKey = (e) => {
      const l = e.key.toUpperCase();
      if (/^[A-Z]$/.test(l)) guess(l);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [guess]);

  const newGame = (cat = category) => {
    setCategory(cat);
    setWord(getWord(cat));
    setGuessed(new Set());
  };

  const hint = () => {
    const unguessed = word.split("").filter(l => !guessed.has(l));
    if (!unguessed.length) return;
    const pick = unguessed[Math.floor(Math.random() * unguessed.length)];
    setGuessed(g => new Set([...g, pick]));
    // Hint counts as a wrong guess penalty
    setGuessed(g => new Set([...g, `_hint_${Date.now()}`]));
  };

  return (
    <div className="flex flex-col items-center gap-6 pb-16">

      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">🔤</span>
        <h1 className="font-display text-[1.8rem] font-extrabold text-slate-100">Hangman</h1>
      </div>

      {/* Category + score */}
      <div className="flex items-center justify-between w-full max-w-md flex-wrap gap-3">
        <div className="flex gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => newGame(c)}
              className={`font-mono text-[11px] tracking-widest px-3 py-1.5 rounded-sm border
                          transition-all duration-200 capitalize
                          ${category === c
                            ? "bg-cyan-400 text-black border-cyan-400"
                            : "text-slate-500 border-cyan-500/15 hover:border-cyan-400"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 font-mono text-[11px]">
          <span className="text-emerald-400">{scores.wins}W</span>
          <span className="text-slate-600">/</span>
          <span className="text-red-400">{scores.losses}L</span>
        </div>
      </div>

      {/* Gallows */}
      <HangmanFigure wrongCount={wrong.length} />

      {/* Wrong count */}
      <div className="flex items-center gap-2">
        {Array.from({ length: MAX_WRONG }, (_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full border transition-all duration-300
                                   ${i < wrong.length
                                     ? "bg-red-400 border-red-400"
                                     : "bg-transparent border-cyan-500/20"}`} />
        ))}
        <span className="font-mono text-[11px] text-slate-600 ml-2">
          {MAX_WRONG - wrong.length} left
        </span>
      </div>

      {/* Word display */}
      <div className="flex gap-2 flex-wrap justify-center">
        {word.split("").map((letter, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className={`font-display font-extrabold text-[1.6rem] w-9 text-center
                              transition-all duration-200
                              ${guessed.has(letter)
                                ? won ? "text-emerald-400" : "text-cyan-400"
                                : lost ? "text-red-400" : "text-transparent"
                              }`}>
              {guessed.has(letter) || lost ? letter : "·"}
            </span>
            <div className={`h-0.5 w-9 rounded-full transition-colors duration-200
                             ${guessed.has(letter) ? "bg-cyan-400" : "bg-slate-700"}`} />
          </div>
        ))}
      </div>

      {/* Game over */}
      {over && (
        <div className={`w-full max-w-sm text-center rounded-xl border p-4
                         ${won ? "bg-emerald-400/10 border-emerald-400/30" : "bg-red-400/10 border-red-400/30"}`}>
          <p className={`font-display font-bold text-xl mb-1 ${won ? "text-emerald-400" : "text-red-400"}`}>
            {won ? "🎉 You got it!" : "💀 Game Over"}
          </p>
          {!won && (
            <p className="font-mono text-[12px] text-slate-500 mb-3">
              The word was <span className="text-cyan-400 font-bold">{word}</span>
            </p>
          )}
          <button onClick={() => newGame()}
            className="bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[12px]
                       tracking-widest px-8 py-2.5 rounded-sm transition-all duration-200 mt-2">
            New Word
          </button>
        </div>
      )}

      {/* Keyboard */}
      <div className="flex flex-col gap-1.5 w-full max-w-[396px]">
        {["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"].map((row, ri) => (
          <div key={ri} className="flex gap-1 justify-center flex-wrap">
            {row.split("").map(l => {
              const isWrong   = guessed.has(l) && !word.includes(l);
              const isCorrect = guessed.has(l) &&  word.includes(l);
              return (
                <button key={l} onClick={() => guess(l)}
                  disabled={guessed.has(l) || over}
                  className={`w-9 h-10 rounded-md font-mono font-bold text-[13px] border
                              transition-all duration-150 active:scale-95
                              disabled:cursor-not-allowed
                              ${isCorrect ? "bg-emerald-500 border-emerald-500 text-white opacity-70" : ""}
                              ${isWrong   ? "bg-[#1a2535] border-slate-700 text-slate-700"            : ""}
                              ${!guessed.has(l) ? "bg-[#141c26] border-cyan-500/15 text-slate-300 hover:border-cyan-400 hover:text-cyan-400" : ""}
                             `}>
                  {l}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Hint */}
      {!over && (
        <button onClick={hint}
          className="font-mono text-[11px] text-slate-600 border border-slate-700
                     px-4 py-2 rounded-sm hover:border-amber-400 hover:text-amber-400
                     transition-all duration-200 tracking-widest">
          💡 Hint (costs a life)
        </button>
      )}

      <p className="font-mono text-[10px] text-slate-700">
        Category: <span className="text-cyan-400 capitalize">{category}</span> · Type or click letters
      </p>
    </div>
  );
}
