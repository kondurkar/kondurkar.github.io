// src/pages/Games/MemoryGame/Timer.jsx
import { useEffect, useRef } from "react";

export default function Timer({ isRunning, elapsed, onTick }) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => onTick(), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, onTick]);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[11px] text-slate-500 tracking-widest uppercase">Time</span>
      <span className={`font-mono text-[1.1rem] font-bold tabular-nums
                        ${elapsed > 60 ? "text-amber-400" : "text-cyan-400"}`}>
        {mins}:{secs}
      </span>
    </div>
  );
}
