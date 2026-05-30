import { ME } from "../data/config";

export default function Hero() {
  const words = ME.tagline.split(" ");
  const lastWord = words.pop();
  const firstWords = words.join(" ");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,200,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      <div className="relative max-w-[1100px] mx-auto px-8 w-full">
        {/* Tag */}
        <div className="flex items-center gap-3 font-mono text-[13px] text-cyan-400 tracking-[0.15em] mb-6">
          <span className="block w-10 h-px bg-cyan-400" />
          {ME.role.toLowerCase()}
        </div>

        {/* Headline */}
        <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-slate-100 mb-2">
          {firstWords}
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "1px #00c8ff" }}
          >
            {lastWord}
          </span>
        </h1>

        {/* Subline */}
        <p className="font-mono text-[15px] text-slate-500 mt-8 max-w-[520px] leading-[1.8]">
          {ME.subline.split(/(fast|accessible|visually sharp)/g).map((chunk, i) =>
            ["fast", "accessible", "visually sharp"].includes(chunk) ? (
              <span key={i} className="text-emerald-400">{chunk}</span>
            ) : (
              chunk
            )
          )}
        </p>

        {/* CTAs */}
        
        <div className="flex gap-4 mt-10 flex-wrap">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black
                       font-mono text-[13px] tracking-widest px-7 py-3 rounded-sm transition-all duration-200
                       hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(0,200,255,0.4)]"
          >
            View Projects →
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-transparent text-cyan-400
                       border border-cyan-500/25 font-mono text-[13px] tracking-widest px-7 py-3 rounded-sm
                       transition-all duration-200 hover:bg-cyan-500/6 hover:border-cyan-400 hover:-translate-y-0.5"
          >
            Get in touch
          </a>
        </div>
       
        {/* Status */}
        {ME.available && (
          <div className="flex items-center gap-2 mt-12 font-mono text-[12px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse
                             shadow-[0_0_0_0_rgba(0,255,157,0.4)]" />
            {ME.availableText}
          </div>
        )}
      </div>
    </section>
  );
}
