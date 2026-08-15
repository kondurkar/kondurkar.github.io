import { SKILLS } from "../data/config";
import { useFadeUp } from "../hooks/useFadeUp";
import SectionLabel from "./SectionLabel";

function SkillCard({ icon, name, desc, level, tags }) {
  const ref = useFadeUp();
  return (
    <div
      ref={ref}
      className="fade-up relative bg-[#141c26] border border-cyan-500/10 rounded overflow-hidden
                 p-6 transition-all duration-200 hover:border-cyan-500/25 hover:bg-[#1a2535]
                 hover:-translate-y-0.5 group"
    >
      {/* top bar on hover */}
      <span
        className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100
                   transition-transform duration-300 origin-left"
        style={{ background: "linear-gradient(90deg, #00c8ff, #00ff9d)" }}
      />

      <div className="text-[1.75rem] mb-3">{icon}</div>
      <div className="font-display font-semibold text-[15px] text-slate-100 mb-1">{name}</div>
      <p className="text-[13px] text-slate-400 mt-1">{desc}</p>

      {/* Progress bar */}
      <div className="mt-3 h-[3px] rounded bg-white/5 overflow-hidden">
        <div
          className="h-full rounded"
          style={{
            width: `${level}%`,
            background: "linear-gradient(90deg, #00c8ff, #00ff9d)",
          }}
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3">
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
    </div>
  );
}

export default function Skills() {
  const titleRef = useFadeUp();

  return (
    <section id="skills" className="relative z-10 max-w-[1100px] mx-auto px-8 py-24">
      <SectionLabel index="02" label="skills" />
      <h2 ref={titleRef} className="fade-up font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-slate-100 mb-10">
        Tech Stack
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SKILLS.map((s) => (
          <SkillCard key={s.name} {...s} />
        ))}
      </div>
    </section>
  );
}
