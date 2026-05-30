import { Link } from "react-router-dom";
import { PROJECTS } from "../data/config";
import { useFadeUp } from "../hooks/useFadeUp";
import SectionLabel from "./SectionLabel";
import ProjectTile from "./ProjectTile";

export default function Projects() {
  const titleRef = useFadeUp();
  const btnRef   = useFadeUp();
  const featured = PROJECTS.slice(0, 3);

  return (
    <section
      id="projects"
      className="relative z-10 max-w-[1100px] mx-auto px-8 py-24"
    >
      <SectionLabel index="04" label="projects" />
      <div className="flex items-end justify-between mb-3 flex-wrap gap-4">
        <h2
          ref={titleRef}
          className="fade-up font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-slate-100 mb-3"
        >
          Selected Work
        </h2>
        <Link
          ref={btnRef}
          to="/projects"
          className="fade-up font-mono text-[13px] text-cyan-400 no-underline border border-cyan-500/25
                      px-5 py-2.5 rounded-sm hover:bg-cyan-500/6 hover:border-cyan-400 transition-all duration-200"
        >
          View all {PROJECTS.length} projects →
        </Link>
      </div>
      <p className="fade-up text-slate-500 text-[14px] mb-10 font-mono">
        A mix of client work, enterprise tools, and CMS platforms — some
        confidential, some live.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.map((p) => (
          <ProjectTile key={p.label} {...p} />
        ))}
      </div>
    </section>
  );
}
