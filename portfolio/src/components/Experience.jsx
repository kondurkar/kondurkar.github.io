import { EXPERIENCE } from "../data/config";
import { useFadeUp } from "../hooks/useFadeUp";
import SectionLabel from "./SectionLabel";

function TimelineItem({ date, role, company, desc, stack }) {
  const ref = useFadeUp();
  return (
    <div ref={ref} className="fade-up relative mb-12 last:mb-0">
      {/* dot */}
      <span
        className="absolute -left-[2.5rem] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400
                   border-2 border-[#080c10] shadow-[0_0_12px_rgba(0,200,255,0.5)]"
      />
      <div className="font-mono text-[12px] text-cyan-400 tracking-[0.1em] mb-1">{date}</div>
      <div className="font-display text-[1.2rem] font-bold text-slate-100 mb-0.5">{role}</div>
      <div className="font-mono text-[13px] text-slate-500 mb-3">{company}</div>
      <p className="text-slate-500 text-[15px] leading-[1.8]">{desc}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {stack.map((t) => (
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

export default function Experience() {
  const titleRef = useFadeUp();

  return (
    <section id="experience" className="relative z-10 max-w-[1100px] mx-auto px-8 py-24">
      <SectionLabel index="03" label="experience" />
      <h2 ref={titleRef} className="fade-up font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-slate-100 mb-10">
        Where I've Worked
      </h2>

      {/* Timeline */}
      <div
        className="relative pl-10"
        style={{
          borderLeft: "1px solid",
          borderImageSlice: 1,
          borderImageSource: "linear-gradient(to bottom, #00c8ff, transparent)",
        }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
          style={{ background: "linear-gradient(to bottom, #00c8ff, transparent)" }}
        />
        {EXPERIENCE.map((exp, i) => (
          <TimelineItem key={i} {...exp} />
        ))}
      </div>
    </section>
  );
}
