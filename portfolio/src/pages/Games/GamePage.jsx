// src/pages/Games/GamePage.jsx
// Reads component directly from GAMES — no registry needed
import { Suspense } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { GAMES } from "../../data/games";
import Navbar from "../../components/Navbar";
import CursorGlow from "../../components/CursorGlow";

function GameLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      <p className="font-mono text-[13px] text-slate-500 tracking-widest">Loading game...</p>
    </div>
  );
}

export default function GamePage() {
  const { slug } = useParams();
  const game = GAMES.find(g => g.slug === slug);

  if (!game?.component) return <Navigate to="/games" replace />;

  const GameComp = game.component;

  return (
    <div className="relative bg-[#080c10] text-slate-100 min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")` }}
      />
      <CursorGlow />
      <Navbar />

      {/* Game header */}
      <div className="relative z-10 mt-10 border-b border-cyan-500/10 bg-[#0d1117]/80 backdrop-blur-sm">
        <div className="max-w-[1100px] mx-auto px-8 h-14 flex items-center justify-between pt-16">
          <div className="flex items-center gap-3">
            <span className="text-xl">{game.emoji}</span>
            <span className="font-display font-bold text-slate-100">{game.name}</span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-400/10
                             border border-emerald-400/20 px-2 py-0.5 rounded-sm tracking-wide">
              Live
            </span>
          </div>
          <Link to="/games"
            className="font-mono text-[12px] text-slate-500 no-underline hover:text-cyan-400
                       transition-colors duration-200">
            ← All Games
          </Link>
        </div>
      </div>

      <main className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-8 py-10">
        <Suspense fallback={<GameLoader />}>
          <GameComp />
        </Suspense>
      </main>
    </div>
  );
}
