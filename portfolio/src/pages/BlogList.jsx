import { Link } from "react-router-dom";
import { BLOGS } from "../data/blogs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CursorGlow from "../components/CursorGlow";

export default function BlogList() {
  return (
    <div className="relative bg-[#080c10] text-slate-100 overflow-x-hidden min-h-screen">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-60"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)" }}
      />

      <CursorGlow />
      <Navbar />

      <main className="relative z-10 max-w-[900px] mx-auto px-8 pt-32 pb-24">
        {/* Header */}
        <div className="mb-14">
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

        {/* Blog list */}
        <div className="flex flex-col gap-5">
          {BLOGS.map((post, i) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block bg-[#141c26] border border-cyan-500/10 rounded p-7 no-underline
                         transition-all duration-200 hover:border-cyan-500/25 hover:-translate-y-0.5
                         hover:shadow-[0_0_24px_rgba(0,200,255,0.08)]"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="font-mono text-[11px] text-cyan-400 tracking-[0.1em]">
                      {post.date} · {post.readTime}
                    </span>
                    <span className="font-mono text-[11px] text-slate-600">#{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h2 className="font-display font-bold text-[1.2rem] text-slate-100 leading-snug mb-3
                                 group-hover:text-cyan-400 transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="text-[14px] text-slate-500 leading-[1.7]">{post.excerpt}</p>
                </div>
                <span className="font-mono text-[13px] text-cyan-400 shrink-0 mt-1
                                 group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="font-mono text-[11px] text-cyan-400 bg-cyan-400/8 border border-cyan-400/15
                               px-2.5 py-0.5 rounded-sm tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-14">
          <Link
            to="/"
            className="font-mono text-[13px] text-slate-500 no-underline hover:text-cyan-400
                       transition-colors duration-200 flex items-center gap-2"
          >
            ← Back to portfolio
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
