import { Link } from "react-router-dom";

const STATUS_BADGE = {
  "live":        { label: "Live",        cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  "wip":         { label: "In Progress", cls: "text-amber-400   bg-amber-400/10   border-amber-400/20"  },
  "coming-soon": { label: "Coming Soon", cls: "text-slate-400   bg-slate-400/10   border-slate-400/20"  },
};

export default function GameTile({ slug, name, desc, tags, emoji, status, highlight }) {
  const badge   = STATUS_BADGE[status] ?? STATUS_BADGE["live"];
  const isLive  = status === "live";

  return (
    <div className="group flex flex-col bg-[#141c26] border border-cyan-500/10 rounded overflow-hidden
                    transition-all duration-200 hover:border-cyan-500/25 hover:-translate-y-1
                    hover:shadow-[0_0_24px_rgba(0,200,255,0.12)]">

      {/* Accent bar */}
      <div className="h-[3px] w-full shrink-0"
        style={{ background: `linear-gradient(90deg, ${highlight ?? "#00c8ff"}, #00ff9d)` }} />

      {/* Emoji hero */}
      <div className="flex items-center justify-center h-28 bg-[#0d1117] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(0,200,255,0.04) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,200,255,0.04) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }} />
        <span className="text-[3.5rem] z-10 group-hover:scale-110 transition-transform duration-300 select-none">
          {emoji}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="font-display font-bold text-[1rem] text-slate-100 leading-snug
                          group-hover:text-cyan-400 transition-colors duration-200">
            {name}
          </div>
          <span className={`font-mono text-[10px] border px-2 py-0.5 rounded-sm tracking-wide shrink-0 ${badge.cls}`}>
            {badge.label}
          </span>
        </div>

        <p className="text-[13px] text-slate-500 leading-[1.7] flex-1">{desc}</p>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {tags.map(t => (
            <span key={t} className="font-mono text-[10px] text-cyan-400 bg-cyan-400/8
                                     border border-cyan-400/15 px-2 py-0.5 rounded-sm tracking-wide">
              {t}
            </span>
          ))}
        </div>

        {/* Play button → internal route */}
        <div className="mt-4 pt-3 border-t border-cyan-500/8">
          {isLive ? (
            <Link to={`/games/${slug}`}
              className="flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300
                         text-black font-mono text-[11px] tracking-widest px-4 py-2.5 rounded-sm
                         no-underline transition-all duration-200 hover:-translate-y-0.5
                         hover:shadow-[0_0_16px_rgba(0,200,255,0.35)] w-full">
              ▶ Play Now
            </Link>
          ) : (
            <div className="flex items-center justify-center font-mono text-[11px]
                            text-slate-600 tracking-widest border border-slate-800 rounded-sm py-2.5 w-full">
              {status === "wip" ? "🔧 In Progress" : "⏳ Coming Soon"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
