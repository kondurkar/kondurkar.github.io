import { useState, useEffect } from "react";
import { useSEO } from "../hooks/useSEO";
import { Link } from "react-router-dom";
import { PROJECTS } from "../data/config";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CursorGlow from "../components/CursorGlow";
import ProjectTile from "../components/ProjectTile";

// Collect all unique tags across projects
const ALL_TAGS = ["All", ...Array.from(new Set(PROJECTS.flatMap(p => p.tags)))];

export default function ProjectList() {
  const [activeTag, setActiveTag] = useState("All");

  useSEO({
    title: "Projects — Yogesh Kondurkar | React, Angular, Frontend Work",
    description: "Portfolio of frontend projects by Yogesh Kondurkar — React dashboards, Figma-to-code builds, PSD-to-HTML animations, and enterprise UI systems built over 10+ years.",
    url: "/projects",
  });

  const filtered = activeTag === "All"
    ? PROJECTS
    : PROJECTS.filter(p => p.tags.includes(activeTag));

  return (
    <div className="relative bg-[#080c10] text-slate-100 overflow-x-hidden min-h-screen">
      {/* Noise */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")` }}
      />
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)" }}
      />

      <CursorGlow />
      <Navbar />

      <main className="relative z-10 max-w-[1200px] mx-auto px-8 pt-32 pb-24">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 font-mono text-[12px] text-cyan-400 tracking-[0.2em] uppercase mb-3">
            work
            <span className="h-px w-[60px] bg-cyan-400 opacity-40" />
          </div>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-extrabold text-slate-100 leading-tight mb-4">
            All Projects
          </h1>
          <p className="text-slate-500 text-[15px] max-w-[560px] leading-relaxed">
            10+ years of client work, enterprise tools, CMS platforms, and frontend systems — across pharma, tech, energy, and real estate.
          </p>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`font-mono text-[11px] tracking-widest px-4 py-1.5 rounded-sm border transition-all duration-200
                ${activeTag === tag
                  ? "text-black bg-cyan-400 border-cyan-400"
                  : "text-slate-500 bg-transparent border-cyan-500/15 hover:border-cyan-500/40 hover:text-slate-300"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid — 4 cols on xl, 3 on lg, 2 on sm, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProjectTile key={p.label} {...p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 font-mono text-slate-600 text-[14px]">
            No projects match this filter.
          </div>
        )}

        {/* Back */}
        <div className="mt-14">
          <Link to="/" className="font-mono text-[13px] text-slate-500 no-underline hover:text-cyan-400
                                   transition-colors duration-200 flex items-center gap-2">
            ← Back to portfolio
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
