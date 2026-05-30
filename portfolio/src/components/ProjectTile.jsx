// Shared tile component used on both home and /projects page

export default function ProjectTile({ label, name, desc, tags, demo, github, showDemo, showGithub, client, websites, code }) {
  return (
    <div
      className="group flex flex-col bg-[#141c26] border border-cyan-500/10 rounded overflow-hidden
                 transition-all duration-200 hover:border-cyan-500/25 hover:-translate-y-1
                 hover:shadow-[0_0_24px_rgba(0,200,255,0.12)]"
    >
      {/* Code preview header */}
      <div className="relative h-36 bg-[#0d1117] flex items-center justify-center overflow-hidden shrink-0">
        <pre className="absolute inset-0 p-4 font-mono text-[10.5px] leading-[1.65] text-cyan-400/20
                        overflow-hidden select-none whitespace-pre-wrap pointer-events-none">
          {code}
        </pre>
        {/* Label pill */}
        <span className="relative z-10 font-mono text-[11px] font-bold tracking-[0.18em] text-cyan-400
                         bg-cyan-400/10 border border-cyan-400/20 px-3 py-1.5 rounded-sm uppercase">
          {label}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {client && (
          <span className="font-mono text-[10px] text-slate-600 tracking-[0.15em] uppercase mb-1.5">
            {client}
          </span>
        )}
        <div className="font-display font-bold text-[1rem] text-slate-100 leading-snug mb-2
                        group-hover:text-cyan-400 transition-colors duration-200">
          {name}
        </div>
        <p className="text-[13px] text-slate-500 leading-[1.7] flex-1">{desc}</p>

        {/* Multi-site links */}
        {websites?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {websites.map(({ label: l, url }) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-emerald-400 bg-emerald-400/8 border border-emerald-400/20
                           px-2 py-0.5 rounded-sm tracking-wide no-underline
                           hover:bg-emerald-400/15 transition-all duration-200"
              >
                {l} ↗
              </a>
            ))}
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-cyan-500/8 flex-wrap gap-2">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="font-mono text-[10px] text-cyan-400 bg-cyan-400/8 border border-cyan-400/15
                                       px-2 py-0.5 rounded-sm tracking-wide">
                {t}
              </span>
            ))}
          </div>
          <div className="shrink-0">
            {showDemo && demo !== "#" && (
              <a href={demo} target="_blank" rel="noopener noreferrer"
                 className="font-mono text-[11px] text-cyan-400 no-underline hover:underline">
                Visit ↗
              </a>
            )}
            {showGithub && github !== "#" && (
              <a href={github} target="_blank" rel="noopener noreferrer"
                 className="font-mono text-[11px] text-cyan-400 no-underline hover:underline ml-3">
                GitHub ↗
              </a>
            )}
            {!showDemo && !showGithub && !websites?.length && (
              <span className="font-mono text-[10px] text-slate-700 italic">Internal</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
