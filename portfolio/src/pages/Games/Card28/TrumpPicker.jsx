// src/pages/Games/Card28/TrumpPicker.jsx
import { SUITS, SUIT_NAMES, SUIT_COLOR } from "./deck";

export function TrumpStylePicker({ onChoose }) {
  return (
    <div className="w-full max-w-sm bg-[#141c26] border border-cyan-500/15 rounded-2xl p-6 text-center">
      <p className="text-3xl mb-2">👑</p>
      <p className="font-display font-bold text-slate-100 text-lg mb-1">You Won the Bid!</p>
      <p className="font-mono text-[12px] text-slate-500 mb-5">Choose how trump will be revealed</p>

      <div className="grid grid-cols-1 gap-3">
        <button onClick={() => onChoose("open")}
          className="flex items-start gap-3 bg-[#1a2535] border border-cyan-500/15 rounded-xl
                     p-4 text-left hover:border-cyan-400 hover:bg-[#223045]
                     active:scale-95 transition-all duration-150">
          <span className="text-2xl">🔓</span>
          <div>
            <p className="font-display font-bold text-slate-100 text-sm">Open Trump</p>
            <p className="font-mono text-[10px] text-slate-500 mt-0.5">
              Trump suit is revealed immediately to everyone.
            </p>
          </div>
        </button>

        <button onClick={() => onChoose("closed")}
          className="flex items-start gap-3 bg-[#1a2535] border border-amber-500/15 rounded-xl
                     p-4 text-left hover:border-amber-400 hover:bg-[#223045]
                     active:scale-95 transition-all duration-150">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-display font-bold text-slate-100 text-sm">Closed Trump</p>
            <p className="font-mono text-[10px] text-slate-500 mt-0.5">
              Trump stays hidden until someone calls for it to be exposed.
              Must be revealed within 7 tricks or the round is invalid.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function TrumpPicker({ onPick }) {
  return (
    <div className="w-full max-w-sm bg-[#141c26] border border-cyan-500/15 rounded-2xl p-6 text-center">
      <p className="text-3xl mb-2">🃏</p>
      <p className="font-display font-bold text-slate-100 text-lg mb-1">Choose Trump Suit</p>
      <p className="font-mono text-[12px] text-slate-500 mb-5">This will be your trump for the round</p>

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
