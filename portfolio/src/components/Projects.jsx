import { PROJECTS } from "../data/config";
import { useFadeUp } from "../hooks/useFadeUp";
import SectionLabel from "./SectionLabel";

function ProjectCard({ label, name, desc, tags, demo, github, code }) {
  const ref = useFadeUp();
  return (
    <div
      ref={ref}
      className="fade-up flex flex-col bg-[#141c26] border border-cyan-500/10 rounded overflow-hidden
                 transition-all duration-200 hover:border-cyan-500/25 hover:-translate-y-1
                 hover:shadow-[0_0_24px_rgba(0,200,255,0.15)]"
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-[#111820] flex items-center justify-center overflow-hidden">
        <pre
          className="absolute inset-0 p-4 font-mono text-[11px] leading-[1.6] text-cyan-400/20
                     overflow-hidden select-none whitespace-pre-wrap"
        >
          {code}
        </pre>
        <span className="font-display text-[1.5rem] font-extrabold text-cyan-400 opacity-40 z-10 tracking-[-0.02em]">
          {label}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        <div className="font-display font-bold text-[1.1rem] text-slate-100 mb-2">{name}</div>
        <p className="text-[14px] text-slate-500 leading-[1.7] flex-1">{desc}</p>

        <div className="flex items-center justify-between mt-5">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="font-mono text-[11px] text-cyan-400 bg-cyan-400/8 border border-cyan-400/15
                           px-2.5 py-0.5 rounded-sm tracking-wide"
              >
                {t}
              </span>
            ))}
          </div>
          {/* <div className="flex gap-3 shrink-0 ml-3">
            {demo !== "#" && (
              <a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[12px] text-cyan-400 no-underline tracking-wide
                           border-b border-transparent hover:border-cyan-400 transition-colors"
              >
                Demo ↗
              </a>
            )}
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12px] text-cyan-400 no-underline tracking-wide
                         border-b border-transparent hover:border-cyan-400 transition-colors"
            >
              GitHub ↗
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const titleRef = useFadeUp();

  return (
    <section id="projects" className="relative z-10 max-w-[1100px] mx-auto px-8 py-24">
      <SectionLabel index="04" label="projects" />
      <h2 ref={titleRef} className="fade-up font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-slate-100 mb-10">
        Selected Work
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.label} {...p} />
        ))}
      </div>
    </section>
  );
}
