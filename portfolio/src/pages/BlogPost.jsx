import { useParams, Link, Navigate } from "react-router-dom";
import { BLOGS } from "../data/blogs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CursorGlow from "../components/CursorGlow";
import { useSEO } from "../hooks/useSEO";

// Simple markdown-to-JSX renderer (no library needed)
function renderContent(content) {
  const lines = content.trim().split("\n");
  const elements = [];
  let i = 0;
  let keyCounter = 0;
  const key = () => keyCounter++;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={key()} className="my-6 rounded overflow-hidden border border-cyan-500/15">
          {lang && (
            <div className="bg-[#0d1117] border-b border-cyan-500/10 px-4 py-2 font-mono text-[11px] text-cyan-400 tracking-widest">
              {lang}
            </div>
          )}
          <pre className="bg-[#0a0f16] p-5 overflow-x-auto text-[13px] leading-[1.7]">
            <code className="text-slate-300 font-mono">{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Table
    if (line.startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter(l => !l.match(/^\|[-| ]+\|$/));
      elements.push(
        <div key={key()} className="my-6 overflow-x-auto">
          <table className="w-full text-[14px] border-collapse">
            {rows.map((row, ri) => {
              const cells = row.split("|").filter(c => c.trim() !== "");
              const Tag = ri === 0 ? "th" : "td";
              return (
                <tr key={ri} className={ri === 0 ? "border-b border-cyan-500/20" : "border-b border-slate-800"}>
                  {cells.map((cell, ci) => (
                    <Tag
                      key={ci}
                      className={`px-4 py-2.5 text-left font-mono text-[12px] tracking-wide
                        ${ri === 0 ? "text-cyan-400" : "text-slate-400"}`}
                    >
                      {cell.trim()}
                    </Tag>
                  ))}
                </tr>
              );
            })}
          </table>
        </div>
      );
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key()} className="font-display text-[1.6rem] font-bold text-slate-100 mt-12 mb-4 leading-tight">
          {line.slice(3)}
        </h2>
      );
      i++; continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key()} className="font-display text-[1.15rem] font-semibold text-slate-200 mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
      i++; continue;
    }

    // Unordered list
    if (line.match(/^[-*] /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key()} className="my-4 space-y-2 pl-4">
          {items.map((item, idx) => (
            <li key={idx} className="text-slate-400 text-[15px] leading-relaxed flex gap-2">
              <span className="text-cyan-400 shrink-0 leading-[1.45]">›</span>
              <span>{inlineFormat(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={key()} className="my-4 space-y-2 pl-4 list-none">
          {items.map((item, idx) => (
            <li key={idx} className="text-slate-400 text-[15px] leading-relaxed flex gap-3">
              <span className="font-mono text-[12px] text-cyan-400 shrink-0 mt-0.5 w-4">{idx + 1}.</span>
              <span>{inlineFormat(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") { i++; continue; }

    // Paragraph
    elements.push(
      <p key={key()} className="text-slate-400 text-[15px] leading-[1.9] my-4">
        {inlineFormat(line)}
      </p>
    );
    i++;
  }

  return elements;
}

// Inline formatting: **bold**, `code`
function inlineFormat(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-slate-200 font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="font-mono text-[13px] text-cyan-300 bg-cyan-400/8 border border-cyan-400/15 px-1.5 py-0.5 rounded-sm">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOGS.find(b => b.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useSEO({
    title: `${post.title} — Yogesh Kondurkar`,
    description: post.excerpt,
    url: `/blog/${post.slug}`,
    type: "article",
  });

  const currentIndex = BLOGS.findIndex(b => b.slug === slug);
  const prev = BLOGS[currentIndex + 1];
  const next = BLOGS[currentIndex - 1];

  return (
    <div className="relative bg-[#080c10] text-slate-100 overflow-x-hidden min-h-screen">
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

      <main className="relative z-10 max-w-[1000px] mx-auto px-8 pt-32 pb-24">
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-mono text-[12px] text-slate-500 no-underline
                     hover:text-cyan-400 transition-colors duration-200 mb-10"
        >
          ← All articles
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 font-mono text-[12px] text-cyan-400 tracking-[0.1em] mb-4 flex-wrap">
          <span>{post.date}</span>
          <span className="text-slate-700">·</span>
          <span>{post.readTime}</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold text-slate-100 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-10 pb-10 border-b border-cyan-500/10">
          {post.tags.map(tag => (
            <span key={tag} className="font-mono text-[11px] text-cyan-400 bg-cyan-400/8 border border-cyan-400/15 px-2.5 py-0.5 rounded-sm tracking-wide">
              {tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <article>{renderContent(post.content)}</article>

        {/* Author card */}
        <div className="mt-16 p-6 bg-[#141c26] border border-cyan-500/10 rounded flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0 font-display font-bold text-cyan-400 text-lg">
            YK
          </div>
          <div>
            <div className="font-display font-semibold text-slate-100 mb-1">Yogesh Kondurkar</div>
            <p className="text-slate-500 text-[13px] leading-relaxed">
              Senior Frontend Developer with 10+ years of experience. Writing about React, JavaScript, TypeScript, and everything frontend.
            </p>
            <a
              href="https://www.linkedin.com/in/yogesh-kondurkar"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12px] text-cyan-400 no-underline mt-2 inline-block hover:underline"
            >
              Connect on LinkedIn →
            </a>
          </div>
        </div>

        {/* Prev / Next */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prev && (
            <Link
              to={`/blog/${prev.slug}`}
              className="block bg-[#141c26] border border-cyan-500/10 rounded p-5 no-underline
                         hover:border-cyan-500/25 transition-all duration-200 group"
            >
              <div className="font-mono text-[11px] text-slate-600 mb-2">← Previous</div>
              <div className="font-display font-semibold text-[14px] text-slate-300 group-hover:text-cyan-400 transition-colors leading-snug">
                {prev.title}
              </div>
            </Link>
          )}
          {next && (
            <Link
              to={`/blog/${next.slug}`}
              className="block bg-[#141c26] border border-cyan-500/10 rounded p-5 no-underline
                         hover:border-cyan-500/25 transition-all duration-200 group sm:text-right"
            >
              <div className="font-mono text-[11px] text-slate-600 mb-2">Next →</div>
              <div className="font-display font-semibold text-[14px] text-slate-300 group-hover:text-cyan-400 transition-colors leading-snug">
                {next.title}
              </div>
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
