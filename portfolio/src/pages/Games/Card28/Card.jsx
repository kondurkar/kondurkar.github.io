// src/pages/Games/Card28/Card.jsx
import { SUIT_COLOR } from "./deck";

export default function PlayingCard({ card, faceDown, selected, disabled, small, onClick }) {
  if (faceDown) {
    return (
      <div className={`relative ${small ? "w-9 h-13" : "w-14 h-20"} rounded-md
                       bg-gradient-to-br from-[#1a2535] to-[#0d1117]
                       border border-cyan-500/20 flex items-center justify-center shrink-0`}>
        <div className="w-[60%] h-[60%] rounded-sm border border-cyan-500/15
                        bg-[radial-gradient(circle,rgba(0,200,255,0.08)_0%,transparent_70%)]" />
      </div>
    );
  }

  const colorCls = SUIT_COLOR[card.suit];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative ${small ? "w-9 h-13 text-[10px]" : "w-14 h-20 text-sm"}
                  rounded-md bg-[#f4f1ea] border-2 flex flex-col items-center justify-between
                  p-1 shrink-0 transition-all duration-150 select-none
                  ${disabled ? "opacity-40 cursor-not-allowed grayscale" : "cursor-pointer hover:-translate-y-2"}
                  ${selected ? "border-cyan-400 -translate-y-3 shadow-[0_0_16px_rgba(0,200,255,0.4)]" : "border-slate-300"}
                 `}
    >
      <span className={`font-display font-bold leading-none self-start ${colorCls}`}>
        {card.rank}
      </span>
      <span className={`${small ? "text-base" : "text-2xl"} leading-none ${colorCls}`}>
        {card.suit}
      </span>
      <span className={`font-display font-bold leading-none self-end rotate-180 ${colorCls}`}>
        {card.rank}
      </span>
    </button>
  );
}