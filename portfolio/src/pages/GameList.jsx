import { useState } from "react";
import { Link } from "react-router-dom";
import { GAMES } from "../data/games";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CursorGlow from "../components/CursorGlow";
import GameTile from "../components/GameTile";

const ALL_TAGS = ["All", ...Array.from(new Set(GAMES.flatMap(g => g.tags)))];
const ALL_STATUS = ["All", "live", "wip", "coming-soon"];

export default function GameList() {
  const [activeTag,    setActiveTag]    = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");

  const filtered = GAMES.filter(g => {
    const tagMatch    = activeTag    === "All" || g.tags.includes(activeTag);
    const statusMatch = activeStatus === "All" || g.status === activeStatus;
    return tagMatch && statusMatch;
  });

  return (
    <div className="relative bg-[#080c10] text-slate-100 overflow-x-hidden min-h-screen">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)" }}
      />

      <CursorGlow />
      <Navbar />

      <main className="relative z-10 max-w-[1200px] mx-auto px-8 pt-32 pb-24">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 font-mono text-[12px] text-cyan-400 tracking-[0.2em] uppercase mb-3">
            games
            <span className="h-px w-[60px] bg-cyan-400 opacity-40" />
          </div>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-extrabold text-slate-100 leading-tight mb-4">
            Side Projects & Games
          </h1>
          <p className="text-slate-500 text-[15px] max-w-[540px] leading-relaxed">
            Fun experiments built with React — sliding puzzles, memory games, and interactive playgrounds.
            All open source on GitHub.
          </p>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {ALL_STATUS.map(s => (
            <button key={s} onClick={() => setActiveStatus(s)}
              className={`font-mono text-[11px] tracking-widest px-4 py-1.5 rounded-sm border transition-all duration-200
                ${activeStatus === s
                  ? "text-black bg-cyan-400 border-cyan-400"
                  : "text-slate-500 bg-transparent border-cyan-500/15 hover:border-cyan-500/40 hover:text-slate-300"}`}>
              {s === "All" ? "All" : s === "live" ? "✅ Live" : s === "wip" ? "🔧 In Progress" : "⏳ Coming Soon"}
            </button>
          ))}
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {ALL_TAGS.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              className={`font-mono text-[11px] tracking-widest px-4 py-1.5 rounded-sm border transition-all duration-200
                ${activeTag === tag
                  ? "text-black bg-cyan-400 border-cyan-400"
                  : "text-slate-500 bg-transparent border-cyan-500/15 hover:border-cyan-500/40 hover:text-slate-300"}`}>
              {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(g => (
            <GameTile key={g.slug} {...g} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 font-mono text-slate-600 text-[14px]">
            No games match this filter.
          </div>
        )}

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