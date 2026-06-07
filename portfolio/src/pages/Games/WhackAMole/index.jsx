// src/pages/Games/WhackAMole/index.jsx
import { useState, useEffect, useRef, useCallback } from "react";

const GRID_SIZE  = 9;
const MOLE_EMOJI = ["🐭","🐹","🐰","🦔"];
const BOMB_EMOJI = "💣";

function getRandomIndex(exclude = []) {
  const available = Array.from({ length: GRID_SIZE }, (_, i) => i)
    .filter(i => !exclude.includes(i));
  return available[Math.floor(Math.random() * available.length)];
}

const DIFFICULTIES = {
  easy:   { label: "Easy",   moleMs: 1200, interval: 900,  bombChance: 0,    points: 1  },
  medium: { label: "Medium", moleMs: 900,  interval: 700,  bombChance: 0.15, points: 2  },
  hard:   { label: "Hard",   moleMs: 600,  interval: 500,  bombChance: 0.25, points: 3  },
};

function Hole({ index, mole, bomb, onWhack }) {
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    if (mole || bomb) setPopping(true);
    else setPopping(false);
  }, [mole, bomb]);

  return (
    <div
      onClick={() => onWhack(index)}
      className={`
        relative flex items-center justify-center
        aspect-square rounded-2xl border cursor-pointer
        overflow-hidden select-none
        transition-all duration-150 active:scale-95
        ${mole
          ? "bg-emerald-400/10 border-emerald-400/30 hover:bg-emerald-400/20"
          : bomb
          ? "bg-red-400/10 border-red-400/30 hover:bg-red-400/20"
          : "bg-[#141c26] border-cyan-500/10 hover:border-cyan-500/20"
        }
      `}
    >
      {/* Hole */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[65%] h-[30%]
                      bg-[#080c10] rounded-full opacity-60" />

      {/* Mole / Bomb */}
      <span
        className={`text-3xl sm:text-4xl z-10 transition-all duration-200
                    ${popping ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      >
        {bomb ? BOMB_EMOJI : mole || ""}
      </span>
    </div>
  );
}

export default function WhackAMole() {
  const [difficulty, setDifficulty] = useState(null);
  const [holes,      setHoles]      = useState(Array(GRID_SIZE).fill(null));  // null | emoji
  const [bombs,      setBombs]      = useState(Array(GRID_SIZE).fill(false));
  const [score,      setScore]      = useState(0);
  const [best,       setBest]       = useState(() => Number(localStorage.getItem("wam-best") || 0));
  const [timeLeft,   setTimeLeft]   = useState(30);
  const [running,    setRunning]    = useState(false);
  const [gameOver,   setGameOver]   = useState(false);
  const [whacked,    setWhacked]    = useState(null); // index of just-whacked hole

  const timers = useRef([]);

  const clearAllTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Spawn moles
  useEffect(() => {
    if (!running || !difficulty) return;
    const cfg = DIFFICULTIES[difficulty];

    const spawn = () => {
      const moleIdx = getRandomIndex();
      const isBomb  = Math.random() < cfg.bombChance;
      const emoji   = MOLE_EMOJI[Math.floor(Math.random() * MOLE_EMOJI.length)];

      setHoles(prev => {
        const next = [...prev];
        next[moleIdx] = isBomb ? null : emoji;
        return next;
      });
      setBombs(prev => {
        const next = [...prev];
        next[moleIdx] = isBomb;
        return next;
      });

      // Hide after moleMs
      const hideTimer = setTimeout(() => {
        setHoles(prev => { const n = [...prev]; n[moleIdx] = null; return n; });
        setBombs(prev => { const n = [...prev]; n[moleIdx] = false; return n; });
      }, cfg.moleMs);

      timers.current.push(hideTimer);
    };

    spawn();
    const spawnInterval = setInterval(spawn, cfg.interval);
    return () => { clearInterval(spawnInterval); clearAllTimers(); };
  }, [running, difficulty]);

  // Countdown
  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(tick);
          setRunning(false);
          setGameOver(true);
          setHoles(Array(GRID_SIZE).fill(null));
          setBombs(Array(GRID_SIZE).fill(false));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [running]);

  // Save best
  useEffect(() => {
    if (!gameOver) return;
    setScore(s => {
      const newBest = Math.max(s, best);
      localStorage.setItem("wam-best", newBest);
      setBest(newBest);
      return s;
    });
  }, [gameOver]);

  const handleWhack = useCallback((index) => {
    if (!running) return;
    const cfg = DIFFICULTIES[difficulty];

    if (bombs[index]) {
      // Hit a bomb — end game
      setRunning(false);
      setGameOver(true);
      setHoles(Array(GRID_SIZE).fill(null));
      setBombs(Array(GRID_SIZE).fill(false));
      return;
    }

    if (!holes[index]) return;

    setWhacked(index);
    setTimeout(() => setWhacked(null), 200);

    setHoles(prev => { const n = [...prev]; n[index] = null; return n; });
    setScore(s => s + cfg.points);
  }, [running, holes, bombs, difficulty]);

  const start = (diff) => {
    setDifficulty(diff);
    setScore(0);
    setTimeLeft(30);
    setHoles(Array(GRID_SIZE).fill(null));
    setBombs(Array(GRID_SIZE).fill(false));
    setGameOver(false);
    setRunning(true);
  };

  const restart = () => start(difficulty);

  // Mode picker
  if (!difficulty || (!running && !gameOver)) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="text-5xl mb-2">🐭</div>
      <h1 className="font-display text-[2rem] font-extrabold text-slate-100">Whack-a-Mole</h1>
      <p className="font-mono text-[13px] text-slate-500 text-center max-w-sm">
        Whack the moles, avoid the bombs. 30 seconds on the clock.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mt-2">
        {Object.entries(DIFFICULTIES).map(([key, { label, points }]) => (
          <button key={key} onClick={() => start(key)}
            className={`flex flex-col items-center gap-2 bg-[#141c26] rounded-xl p-6
                        border transition-all duration-200 hover:-translate-y-1
                        ${key === "easy"   ? "border-emerald-500/20 hover:border-emerald-400" : ""}
                        ${key === "medium" ? "border-amber-500/20   hover:border-amber-400"   : ""}
                        ${key === "hard"   ? "border-red-500/20     hover:border-red-400"     : ""}
                       `}>
            <span className="font-display font-bold text-slate-100 text-[1.1rem]">{label}</span>
            <span className="font-mono text-[11px] text-slate-500">+{points} pt{points > 1 ? "s" : ""} per mole</span>
          </button>
        ))}
      </div>
      {best > 0 && (
        <p className="font-mono text-[12px] text-cyan-400">Best score: {best}</p>
      )}
    </div>
  );

  // Game over screen
  if (gameOver) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="text-5xl">{score > best ? "🏆" : "😅"}</div>
      <h2 className="font-display text-[2rem] font-extrabold text-slate-100">
        {score > best ? "New Best!" : "Time's Up!"}
      </h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="bg-[#141c26] border border-cyan-500/10 rounded-lg p-4 text-center">
          <div className="font-display text-[2rem] font-extrabold text-cyan-400">{score}</div>
          <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">Score</div>
        </div>
        <div className="bg-[#141c26] border border-cyan-500/10 rounded-lg p-4 text-center">
          <div className="font-display text-[2rem] font-extrabold text-cyan-400">{Math.max(score, best)}</div>
          <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">Best</div>
        </div>
      </div>
      <div className="flex gap-3 w-full max-w-xs">
        <button onClick={restart}
          className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[12px]
                     tracking-widest py-3 rounded-sm transition-all duration-200">
          Play Again
        </button>
        <button onClick={() => { setDifficulty(null); setGameOver(false); }}
          className="flex-1 border border-cyan-500/25 text-cyan-400 font-mono text-[12px]
                     tracking-widest py-3 rounded-sm transition-all duration-200
                     hover:border-cyan-400">
          Change Mode
        </button>
      </div>
    </div>
  );

  const cfg = DIFFICULTIES[difficulty];

  return (
    <div className="flex flex-col items-center gap-6 pb-16">

      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐭</span>
          <h1 className="font-display text-[1.4rem] font-extrabold text-slate-100">Whack-a-Mole</h1>
          <span className={`font-mono text-[10px] border px-2 py-0.5 rounded-sm tracking-wide
            ${difficulty === "easy"   ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : ""}
            ${difficulty === "medium" ? "text-amber-400   bg-amber-400/10   border-amber-400/20"   : ""}
            ${difficulty === "hard"   ? "text-red-400     bg-red-400/10     border-red-400/20"     : ""}
          `}>
            {cfg.label}
          </span>
        </div>
        <button onClick={() => { setRunning(false); setGameOver(false); setDifficulty(null); }}
          className="font-mono text-[12px] text-slate-500 hover:text-cyan-400 transition-colors">
          ← Menu
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3">
        <div className="flex flex-col items-center bg-[#141c26] border border-cyan-500/10 rounded-lg px-5 py-3 min-w-[80px]">
          <span className="font-display text-[1.4rem] font-extrabold text-cyan-400">{score}</span>
          <span className="font-mono text-[10px] text-slate-600 tracking-widest uppercase">Score</span>
        </div>
        <div className="flex flex-col items-center bg-[#141c26] border border-cyan-500/10 rounded-lg px-5 py-3 min-w-[80px]">
          <span className={`font-display text-[1.4rem] font-extrabold tabular-nums
                           ${timeLeft <= 5 ? "text-red-400" : "text-cyan-400"}`}>
            {timeLeft}s
          </span>
          <span className="font-mono text-[10px] text-slate-600 tracking-widest uppercase">Time</span>
        </div>
        <div className="flex flex-col items-center bg-[#141c26] border border-cyan-500/10 rounded-lg px-5 py-3 min-w-[80px]">
          <span className="font-display text-[1.4rem] font-extrabold text-slate-500">{best}</span>
          <span className="font-mono text-[10px] text-slate-600 tracking-widest uppercase">Best</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        {Array.from({ length: GRID_SIZE }, (_, i) => (
          <Hole
            key={i}
            index={i}
            mole={holes[i]}
            bomb={bombs[i]}
            onWhack={handleWhack}
          />
        ))}
      </div>

      <p className="font-mono text-[11px] text-slate-700">
        🐭 Whack moles · {difficulty !== "easy" && "💣 Avoid bombs · "} +{cfg.points} pt{cfg.points > 1 ? "s" : ""} each
      </p>
    </div>
  );
}
