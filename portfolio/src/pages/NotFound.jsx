import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const canvasRef = useRef(null);
  const [glitching, setGlitching] = useState(false);
  const location = useLocation();

  // Matrix rain canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";
    const fontSize = 13;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(8,12,16,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const alpha = Math.random() > 0.95 ? 1 : 0.15;
        ctx.fillStyle = `rgba(0,200,255,${alpha})`;
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Glitch effect on interval
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const NAV_LINKS = [
    { label: "Home",     href: "/"         },
    { label: "Projects", href: "/projects" },
    { label: "Blog",     href: "/blog"     },
  ];

  return (
    <div className="relative min-h-screen bg-[#080c10] flex flex-col items-center justify-center overflow-hidden px-6">

      {/* Matrix rain background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
      />

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)" }}
      />

      {/* Radial fade over canvas */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, #080c10 100%)" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">

        {/* 404 glitch text */}
        <div className="relative mb-6 select-none">
          <h1
            className={`font-display font-extrabold text-[clamp(7rem,22vw,12rem)] leading-none
                        text-transparent transition-all duration-75
                        ${glitching ? "translate-x-1 -translate-y-0.5" : ""}`}
            style={{ WebkitTextStroke: "1.5px #00c8ff" }}
          >
            404
          </h1>
          {/* Glitch layers */}
          {glitching && (
            <>
              <h1 className="absolute inset-0 font-display font-extrabold text-[clamp(7rem,22vw,12rem)]
                             leading-none text-transparent translate-x-2"
                style={{ WebkitTextStroke: "1.5px #ff0066", clipPath: "inset(30% 0 50% 0)" }}>
                404
              </h1>
              <h1 className="absolute inset-0 font-display font-extrabold text-[clamp(7rem,22vw,12rem)]
                             leading-none text-transparent -translate-x-2"
                style={{ WebkitTextStroke: "1.5px #00ff9d", clipPath: "inset(60% 0 10% 0)" }}>
                404
              </h1>
            </>
          )}
        </div>

        {/* Error code */}
        <div className="font-mono text-[11px] text-cyan-400 tracking-[0.25em] uppercase mb-4">
          ERROR_CODE: PAGE_NOT_FOUND
        </div>

        {/* Message */}
        <h2 className="font-display text-[1.4rem] font-bold text-slate-100 mb-3">
          This page doesn't exist
        </h2>
        <p className="font-mono text-[13px] text-slate-400 leading-relaxed mb-2">
          The URL{" "}
          <code className="text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded-sm">
            {location.pathname}
          </code>{" "}
          couldn't be found.
        </p>
        <p className="font-mono text-[12px] text-slate-400 mb-10">
          It may have been moved, deleted, or never existed.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black
                       font-mono text-[13px] tracking-widest px-7 py-3 rounded-sm no-underline
                       transition-all duration-200 hover:-translate-y-0.5
                       hover:shadow-[0_0_24px_rgba(0,200,255,0.4)] w-full sm:w-auto justify-center"
          >
            ← Go Home
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-transparent text-cyan-400
                       border border-cyan-500/25 font-mono text-[13px] tracking-widest px-7 py-3
                       rounded-sm no-underline transition-all duration-200
                       hover:bg-cyan-500/6 hover:border-cyan-400 hover:-translate-y-0.5
                       w-full sm:w-auto justify-center"
          >
            View Projects →
          </Link>
        </div>

        {/* Quick nav */}
        <div className="border-t border-cyan-500/10 pt-8">
          <p className="font-mono text-[11px] text-slate-400 tracking-widest uppercase mb-4">
            Or go to
          </p>
          <div className="flex items-center justify-center gap-6">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="font-mono text-[12px] text-slate-400 no-underline
                           hover:text-cyan-400 transition-colors duration-200"
              >
                <span className="text-cyan-400 mr-0.5 opacity-60">_</span>{label}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom corner decoration */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <span className="font-mono text-[11px] text-slate-400 tracking-widest">
          kondurkar.github.io
        </span>
      </div>

    </div>
  );
}