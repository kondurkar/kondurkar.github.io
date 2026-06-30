// src/pages/Games/Card28/Card.jsx
import { SUIT_COLOR } from "./deck";

export default function PlayingCard({ card, faceDown, selected, disabled, small, onClick }) {
  const sizeCls = small ? "w-11 h-16" : "w-16 h-24 sm:w-20 sm:h-28";
  const rankCls = small ? "text-[11px]" : "text-base sm:text-lg";
  const suitCls = small ? "text-lg" : "text-3xl sm:text-4xl";

  if (faceDown) {
    return (
      <div className={`relative ${sizeCls} rounded-lg
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
      className={`relative ${sizeCls} rounded-lg bg-[#f7f4ec] border-2 flex flex-col
                  items-center justify-between p-1.5 shrink-0 transition-all duration-150 select-none
                  ${disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:-translate-y-2"}
                  ${selected ? "border-cyan-400 -translate-y-3 shadow-[0_0_18px_rgba(0,200,255,0.45)]" : "border-slate-300"}
                 `}
    >
      <span className={`font-display font-extrabold leading-none self-start ${rankCls} ${colorCls}`}>
        {card.rank}
      </span>
      <span className={`${suitCls} leading-none ${colorCls}`}>
        {card.suit}
      </span>
      <span className={`font-display font-extrabold leading-none self-end rotate-180 ${rankCls} ${colorCls}`}>
        {card.rank}
      </span>
    </button>
  );
}
