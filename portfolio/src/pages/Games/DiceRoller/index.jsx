// src/pages/Games/DiceRoller/index.jsx
import { useState, useCallback } from "react";

const DICE_FACES = {
  1: ["⚀", [false,false,false,false,true,false,false,false,false]],
  2: ["⚁", [true,false,false,false,false,false,false,false,true]],
  3: ["⚂", [true,false,false,false,true,false,false,false,true]],
  4: ["⚃", [true,false,true,false,false,false,true,false,true]],
  5: ["⚄", [true,false,true,false,true,false,true,false,true]],
  6: ["⚅", [true,false,true,true,false,true,true,false,true]],
};

function Die({ value, rolling, color }) {
  const dots = DICE_FACES[value]?.[1] ?? DICE_FACES[1][1];

  return (
    <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 p-2
                     flex items-center justify-center select-none
                     transition-all duration-150
                     ${rolling ? "animate-spin scale-110" : "scale-100"}
                     bg-[#141c26] shadow-[0_0_20px_rgba(0,200,255,0.1)]`}
         style={{ borderColor: color }}>
      <div className="grid grid-cols-3 gap-1 w-full h-full">
        {dots.map((active, i) => (
          <div key={i} className="flex items-center justify-center">
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                            ${active ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                 style={{ backgroundColor: active ? color : "transparent" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const PRESETS = [
  { label: "1d6",   count: 1, sides: 6  },
  { label: "2d6",   count: 2, sides: 6  },
  { label: "3d6",   count: 3, sides: 6  },
  { label: "1d20",  count: 1, sides: 20 },
  { label: "4d6",   count: 4, sides: 6  },
];

const DIE_COLORS = ["#00c8ff","#00ff9d","#7b5ea7","#f59e0b","#f43f5e"];

export default function DiceRoller() {
  const [diceCount, setDiceCount] = useState(2);
  const [sides,     setSides]     = useState(6);
  const [values,    setValues]    = useState([1, 1]);
  const [rolling,   setRolling]   = useState(false);
  const [history,   setHistory]   = useState([]);

  const roll = useCallback(() => {
    if (rolling) return;
    setRolling(true);

    // Animate — flash random values
    let ticks = 0;
    const interval = setInterval(() => {
      setValues(Array.from({ length: diceCount }, () =>
        Math.ceil(Math.random() * Math.min(sides, 6))
      ));
      ticks++;
      if (ticks >= 10) {
        clearInterval(interval);
        const final = Array.from({ length: diceCount }, () =>
          Math.ceil(Math.random() * sides)
        );
        setValues(final);
        setHistory(h => [
          { dice: final, sides, total: final.reduce((a,b) => a+b, 0), ts: Date.now() },
          ...h.slice(0, 9),
        ]);
        setRolling(false);
      }
    }, 60);
  }, [rolling, diceCount, sides]);

  const total = values.reduce((a, b) => a + b, 0);

  const applyPreset = (p) => {
    setDiceCount(p.count);
    setSides(p.sides);
    setValues(Array.from({ length: p.count }, () => 1));
  };

  return (
    <div className="flex flex-col items-center gap-8 pb-16">

      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">🎲</span>
        <h1 className="font-display text-[1.8rem] font-extrabold text-slate-100">Dice Roller</h1>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 justify-center">
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => applyPreset(p)}
            className={`font-mono text-[12px] tracking-widest px-4 py-2 rounded-sm border
                        transition-all duration-200
                        ${diceCount === p.count && sides === p.sides
                          ? "bg-cyan-400 text-black border-cyan-400"
                          : "text-slate-500 border-cyan-500/15 hover:border-cyan-400 hover:text-cyan-400"
                        }`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom controls */}
      <div className="flex gap-6 flex-wrap justify-center">
        <div className="flex flex-col items-center gap-2">
          <label className="font-mono text-[11px] text-slate-500 tracking-widest uppercase">Dice</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setDiceCount(d => Math.max(1, d - 1))}
              className="w-8 h-8 rounded-sm bg-[#141c26] border border-cyan-500/15
                         text-cyan-400 font-bold hover:border-cyan-400 transition-all">−</button>
            <span className="font-display font-bold text-xl text-slate-100 w-6 text-center">{diceCount}</span>
            <button onClick={() => setDiceCount(d => Math.min(5, d + 1))}
              className="w-8 h-8 rounded-sm bg-[#141c26] border border-cyan-500/15
                         text-cyan-400 font-bold hover:border-cyan-400 transition-all">+</button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <label className="font-mono text-[11px] text-slate-500 tracking-widest uppercase">Sides</label>
          <div className="flex gap-1 flex-wrap justify-center">
            {[4,6,8,10,12,20].map(s => (
              <button key={s} onClick={() => setSides(s)}
                className={`font-mono text-[11px] w-9 h-8 rounded-sm border transition-all
                            ${sides === s
                              ? "bg-cyan-400 text-black border-cyan-400"
                              : "text-slate-500 border-cyan-500/15 hover:border-cyan-400"
                            }`}>
                d{s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dice display */}
      <div className="flex flex-wrap gap-4 justify-center items-center min-h-[120px]">
        {Array.from({ length: diceCount }, (_, i) => (
          <Die
            key={i}
            value={Math.min(values[i] ?? 1, 6)}
            rolling={rolling}
            color={DIE_COLORS[i % DIE_COLORS.length]}
          />
        ))}
      </div>

      {/* Total */}
      <div className="text-center">
        <div className="font-display text-[4rem] font-extrabold text-cyan-400 leading-none">{total}</div>
        <div className="font-mono text-[12px] text-slate-500 tracking-widest mt-1">
          {diceCount > 1 ? `${values.join(" + ")} = ${total}` : `d${sides}`}
        </div>
      </div>

      {/* Roll button */}
      <button onClick={roll} disabled={rolling}
        className="bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black
                   font-mono font-bold text-[14px] tracking-widest px-12 py-4 rounded-sm
                   transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,200,255,0.5)]
                   hover:-translate-y-0.5 active:scale-95">
        {rolling ? "Rolling..." : "🎲 Roll!"}
      </button>

      {/* History */}
      {history.length > 0 && (
        <div className="w-full max-w-sm">
          <p className="font-mono text-[11px] text-slate-600 tracking-widest uppercase mb-3">Roll History</p>
          <div className="flex flex-col gap-1.5">
            {history.map((h, i) => (
              <div key={h.ts}
                className={`flex items-center justify-between bg-[#141c26] border border-cyan-500/10
                            rounded px-4 py-2 transition-opacity ${i === 0 ? "opacity-100" : "opacity-60"}`}>
                <span className="font-mono text-[12px] text-slate-500">{h.dice.join(" + ")}</span>
                <span className="font-display font-bold text-cyan-400">{h.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
