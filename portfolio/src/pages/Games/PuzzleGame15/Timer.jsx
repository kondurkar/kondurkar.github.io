// src/pages/Games/PuzzleGame15/Timer.jsx
import { useEffect } from "react";

export default function Timer({ time, setTime, timerActive }) {
  useEffect(() => {
    let interval = null;
    if (timerActive)
      interval = setInterval(() => setTime(t => t + 1), 1000);
    else
      clearInterval(interval);
    return () => clearInterval(interval);
  }, [timerActive]);

  const mins = String(Math.floor(time / 60)).padStart(2, "0");
  const secs = String(time % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[11px] text-slate-500 tracking-widest uppercase">Time</span>
      <span className="font-mono text-[1rem] font-bold text-cyan-400 tabular-nums">
        {mins}:{secs}
      </span>
    </div>
  );
}
