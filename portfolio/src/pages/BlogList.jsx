import { useState, useEffect } from "react";
import { useSEO } from "../hooks/useSEO";
import { Link } from "react-router-dom";
import { BLOGS } from "../data/blogs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CursorGlow from "../components/CursorGlow";

const ALL_TAGS = [
  "All",
  ...Array.from(new Set(BLOGS.flatMap(b => b.tags)))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
];

function BlogTile({ slug, date, readTime, title, excerpt, tags }) {
  return (
    <Link
      to={`/blog/${slug}`}
      className="group flex flex-col bg-[#141c26] border border-cyan-500/10 rounded overflow-hidden
                 no-underline transition-all duration-200 hover:border-cyan-500/25 hover:-translate-y-1
                 hover:shadow-[0_0_24px_rgba(0,200,255,0.12)]"
    >
      {/* Coloured top accent bar — unique per tag */}
      <div className="h-[3px] w-full shrink-0"
        style={{ background: "linear-gradient(90deg, #00c8ff, #00ff9d)" }} />

      <div className="flex flex-col flex-1 p-5">
        {/* Meta */}
        <div className="font-mono text-[10px] text-cyan-400 tracking-[0.12em] mb-3">
          {date} · {readTime}
        </div>

        {/* Title */}
        <div className="font-display font-bold text-[0.95rem] text-slate-100 leading-snug mb-2
                        group-hover:text-cyan-400 transition-colors duration-200 flex-1">
          {title}
        </div>

        {/* Excerpt */}
        <p className="text-[13px] text-slate-500 leading-[1.7] line-clamp-3">{excerpt}</p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-cyan-500/8 flex-wrap gap-2">
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <span key={tag}
                className="font-mono text-[10px] text-cyan-400 bg-cyan-400/8 border border-cyan-400/15
                           px-2 py-0.5 rounded-sm tracking-wide">
                {tag}
              </span>
            ))}
          </div>
          <span className="font-mono text-[11px] text-cyan-400
                           group-hover:translate-x-1 transition-transform duration-200 shrink-0">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogList() {
  const [activeTag, setActiveTag] = useState("All");

  useSEO({
    title: "Blog & Articles — Yogesh Kondurkar | React, JavaScript, TypeScript",
    description: "Frontend engineering articles on React, JavaScript, TypeScript, CSS and web performance by Yogesh Kondurkar — Senior Frontend Developer with 10+ years experience.",
    url: "/blog",
  });

  const filtered = activeTag === "All"
    ? BLOGS
    : BLOGS.filter(b => b.tags.includes(activeTag));

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
            writing
            <span className="h-px w-[60px] bg-cyan-400 opacity-40" />
          </div>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-extrabold text-slate-100 leading-tight mb-4">
            Blog & Articles
          </h1>
          <p className="text-slate-500 text-[15px] max-w-[540px] leading-relaxed">
            Thoughts on React, JavaScript, TypeScript, CSS, and frontend engineering — from 10+ years in the trenches.
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

        {/* Tile grid — 4 cols xl, 3 lg, 2 sm, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(post => (
            <BlogTile key={post.slug} {...post} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 font-mono text-slate-600 text-[14px]">
            No posts match this filter.
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
