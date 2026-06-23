// src/pages/Games/Card28/TrumpPicker.jsx
import { SUITS, SUIT_NAMES, SUIT_COLOR } from "./deck";

export default function TrumpPicker({ onPick }) {
  return (
    <div className="w-full max-w-sm bg-[#141c26] border border-cyan-500/15 rounded-2xl p-6 text-center">
      <p className="text-3xl mb-2">👑</p>
      <p className="font-display font-bold text-slate-100 text-lg mb-1">You Won the Bid!</p>
      <p className="font-mono text-[12px] text-slate-500 mb-5">Choose the trump suit</p>

      <div className="grid grid-cols-2 gap-3">
        {SUITS.map(suit => (
          <button key={suit} onClick={() => onPick(suit)}
            className="flex flex-col items-center gap-1 bg-[#1a2535] border border-cyan-500/15
                       rounded-xl py-4 hover:border-cyan-400 hover:bg-[#223045]
                       active:scale-95 transition-all duration-150">
            <span className={`text-3xl ${SUIT_COLOR[suit]}`}>{suit}</span>
            <span className="font-mono text-[10px] text-slate-500">{SUIT_NAMES[suit]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
