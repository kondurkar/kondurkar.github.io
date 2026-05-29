import { ME, STATS, ABOUT_PARAGRAPHS } from "../data/config";
import { useFadeUp } from "../hooks/useFadeUp";
import SectionLabel from "./SectionLabel";

export default function About() {
  const ref = useFadeUp();

  return (
    <section id="about" className="relative z-10 max-w-[1100px] mx-auto px-8 py-24">
      <SectionLabel index="01" label="about" />

      <div ref={ref} className="fade-up grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-tight text-slate-100 mb-8">
            Who I Am
          </h2>
          <div className="space-y-4">
            {ABOUT_PARAGRAPHS.map((p, i) => (
              <p
                key={i}
                className="text-slate-500 text-[15px] leading-[1.9]"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>
          {/* <div className="mt-6">
            <a
              href={ME.resumeUrl}
              className="inline-flex items-center gap-2 bg-transparent text-cyan-400
                         border border-cyan-500/25 font-mono text-[13px] tracking-widest px-7 py-3 rounded-sm
                         transition-all duration-200 hover:bg-cyan-500/6 hover:border-cyan-400"
            >
              Download Resume
            </a>
          </div> */}
        </div>

        {/* Stats grid */}
        <div
          className="grid grid-cols-2 gap-px rounded overflow-hidden"
          style={{ background: "rgba(0,200,255,0.12)", border: "1px solid rgba(0,200,255,0.12)" }}
        >
          {STATS.map(({ num, label }) => (
            <div
              key={label}
              className="bg-[#141c26] hover:bg-[#1a2535] transition-colors duration-200 p-7 text-center"
            >
              <div className="font-display text-[2.8rem] font-extrabold text-cyan-400 leading-none mb-1">
                {num}
              </div>
              <div className="font-mono text-[11px] text-slate-500 tracking-[0.1em] uppercase">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
