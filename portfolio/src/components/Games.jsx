import { Link } from "react-router-dom";
import { GAMES } from "../data/games";
import { useFadeUp } from "../hooks/useFadeUp";
import SectionLabel from "./SectionLabel";
import GameTile from "./GameTile";

export default function Games() {
  const titleRef = useFadeUp();
  const btnRef   = useFadeUp();
  const featured = GAMES.slice(0, 3);

  return (
    <section id="games" className="relative z-10 max-w-[1100px] mx-auto px-8 py-24">
      <SectionLabel index="05" label="games" />

      <div className="flex items-end justify-between mb-3 flex-wrap gap-4">
        <h2 ref={titleRef}
          className="fade-up font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-slate-100 mb-0">
          Side Projects & Games
        </h2>
        {GAMES.length > 3 && (
          <Link ref={btnRef} to="/games"
            className="fade-up font-mono text-[13px] text-cyan-400 no-underline border border-cyan-500/25
                       px-5 py-2.5 rounded-sm hover:bg-cyan-500/6 hover:border-cyan-400 transition-all duration-200">
            View all {GAMES.length} games →
          </Link>
        )}
      </div>

      <p className="text-slate-400 text-[14px] mb-10 font-mono">
        Fun experiments and interactive projects built with React — games, tools, and playgrounds.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.map(g => (
          <GameTile key={g.slug} {...g} />
        ))}
      </div>

    </section>
  );
}