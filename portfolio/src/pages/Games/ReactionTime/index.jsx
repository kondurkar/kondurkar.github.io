// src/pages/Games/ReactionTime/index.jsx
import { useState, useRef, useCallback, useEffect } from "react";

const STATES = {
  idle:    "idle",
  waiting: "waiting",   // waiting for green
  ready:   "ready",     // GO! — click now
  early:   "early",     // clicked too early
  result:  "result",    // showed result
};

const RATING = [
  { max: 150,  label: "Superhuman ⚡",    color: "text-emerald-300" },
  { max: 200,  label: "Elite 🏆",          color: "text-emerald-400" },
  { max: 250,  label: "Excellent 🎯",      color: "text-cyan-400"    },
  { max: 300,  label: "Good 👍",           color: "text-cyan-500"    },
  { max: 400,  label: "Average 😊",        color: "text-amber-400"   },
  { max: 500,  label: "Slow 🐢",           color: "text-orange-400"  },
  { max: Infinity, label: "Very Slow 😴",  color: "text-red-400"     },
];

function getRating(ms) {
  return RATING.find(r => ms < r.max) ?? RATING[RATING.length - 1];
}

export default function ReactionTime() {
  const [state,    setState]    = useState(STATES.idle);
  const [elapsed,  setElapsed]  = useState(null);
  const [results,  setResults]  = useState([]);
  const [best,     setBest]     = useState(() => Number(localStorage.getItem("rt-best") || 0));

  const startRef   = useRef(null);
  const timerRef   = useRef(null);
  const delayRef   = useRef(null);

  const clearTimers = () => {
    clearTimeout(timerRef.current);
    clearTimeout(delayRef.current);
  };

  const start = useCallback(() => {
    clearTimers();
    setState(STATES.waiting);
    setElapsed(null);

    // Random delay 1.5s – 5s
    const delay = 1500 + Math.random() * 3500;
    delayRef.current = setTimeout(() => {
      setState(STATES.ready);
      startRef.current = performance.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (state === STATES.idle || state === STATES.result) {
      start();
      return;
    }

    if (state === STATES.waiting) {
      // Clicked too early
      clearTimers();
      setState(STATES.early);
      return;
    }

    if (state === STATES.ready) {
      const ms = Math.round(performance.now() - startRef.current);
      setElapsed(ms);
      setResults(r => [ms, ...r].slice(0, 10));
      setBest(b => {
        const newBest = b === 0 ? ms : Math.min(b, ms);
        localStorage.setItem("rt-best", newBest);
        return newBest;
      });
      setState(STATES.result);
    }
  }, [state, start]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space") { e.preventDefault(); handleClick(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClick]);

  useEffect(() => () => clearTimers(), []);

  const avg = results.length
    ? Math.round(results.reduce((a,b) => a+b, 0) / results.length)
    : null;

  const BG = {
    [STATES.idle]:    "bg-[#141c26] border-cyan-500/20",
    [STATES.waiting]: "bg-[#0d1117] border-slate-700",
    [STATES.ready]:   "bg-emerald-500/20 border-emerald-400",
    [STATES.early]:   "bg-red-500/20 border-red-400",
    [STATES.result]:  "bg-[#141c26] border-cyan-500/20",
  };

  const LABEL = {
    [STATES.idle]:    { title: "Click to Start",         sub: "or press Space"                              },
    [STATES.waiting]: { title: "Wait for green...",      sub: "Don't click yet!"                           },
    [STATES.ready]:   { title: "CLICK NOW!",             sub: "React as fast as you can"                   },
    [STATES.early]:   { title: "Too Early! 🚫",          sub: "Click to try again"                         },
    [STATES.result]:  { title: `${elapsed}ms`,           sub: getRating(elapsed)?.label ?? ""              },
  };

  return (
    <div className="flex flex-col items-center gap-8 pb-16">

      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">⏱️</span>
        <h1 className="font-display text-[1.8rem] font-extrabold text-slate-100">Reaction Time</h1>
      </div>

      {/* Stats */}
      {(best > 0 || results.length > 0) && (
        <div className="flex gap-3 flex-wrap justify-center">
          {best > 0 && (
            <div className="flex flex-col items-center bg-[#141c26] border border-cyan-500/10 rounded-lg px-5 py-3">
              <span className="font-display text-[1.4rem] font-extrabold text-emerald-400">{best}ms</span>
              <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">Best</span>
            </div>
          )}
          {avg && (
            <div className="flex flex-col items-center bg-[#141c26] border border-cyan-500/10 rounded-lg px-5 py-3">
              <span className="font-display text-[1.4rem] font-extrabold text-cyan-400">{avg}ms</span>
              <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">Avg ({results.length})</span>
            </div>
          )}
        </div>
      )}

      {/* Main click target */}
      <div
        onClick={handleClick}
        className={`w-full max-w-sm h-56 rounded-2xl border-2 flex flex-col items-center
                    justify-center cursor-pointer select-none transition-all duration-200
                    active:scale-98 ${BG[state]}`}
      >
        <div className={`font-display font-extrabold text-center leading-tight
                         ${state === STATES.ready  ? "text-emerald-400 text-[2.5rem]" : ""}
                         ${state === STATES.early  ? "text-red-400 text-[2rem]"       : ""}
                         ${state === STATES.result ? "text-cyan-400 text-[3rem]"      : ""}
                         ${state === STATES.idle || state === STATES.waiting ? "text-slate-300 text-[1.6rem]" : ""}
                        `}>
          {LABEL[state].title}
        </div>
        <div className={`font-mono text-[13px] mt-2 tracking-wide
                         ${state === STATES.result ? getRating(elapsed)?.color : "text-slate-500"}`}>
          {LABEL[state].sub}
        </div>

        {state === STATES.waiting && (
          <div className="mt-4 flex gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-slate-600 animate-pulse"
                   style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        )}
      </div>

      {/* Result rating bar */}
      {state === STATES.result && elapsed && (
        <div className="w-full max-w-sm">
          <div className="flex justify-between font-mono text-[10px] text-slate-600 mb-1.5">
            <span>0ms</span><span>500ms+</span>
          </div>
          <div className="h-2 bg-[#141c26] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min((elapsed / 500) * 100, 100)}%`,
                background: elapsed < 250
                  ? "linear-gradient(90deg, #00ff9d, #00c8ff)"
                  : elapsed < 400
                  ? "linear-gradient(90deg, #00c8ff, #f59e0b)"
                  : "linear-gradient(90deg, #f59e0b, #f43f5e)",
              }} />
          </div>
        </div>
      )}

      {/* History */}
      {results.length > 0 && (
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <p className="font-mono text-[11px] text-slate-600 tracking-widest uppercase">Last {results.length} results</p>
            <button onClick={() => { setResults([]); setBest(0); localStorage.removeItem("rt-best"); }}
              className="font-mono text-[10px] text-slate-600 hover:text-red-400 transition-colors">
              Clear
            </button>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {results.map((r, i) => {
              const rating = getRating(r);
              return (
                <div key={i} className="flex flex-col items-center bg-[#141c26]
                                        border border-cyan-500/8 rounded-lg py-2">
                  <span className={`font-mono text-[11px] font-bold ${rating.color}`}>{r}</span>
                  <span className="font-mono text-[9px] text-slate-700">ms</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="font-mono text-[11px] text-slate-700">Click the box or press Space</p>
    </div>
  );
}
