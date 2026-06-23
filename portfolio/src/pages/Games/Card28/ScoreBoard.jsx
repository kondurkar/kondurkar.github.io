// src/pages/Games/Card28/ScoreBoard.jsx
import { scoreToPips } from "./scoring";

function PipRow({ score, label }) {
  const pips = scoreToPips(score);
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] text-slate-500 tracking-widest w-10">{label}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 6 }, (_, i) => {
          const pip = pips[i];
          const isActive = !!pip;
          return (
            <span key={i}
              className={`w-2.5 h-2.5 rounded-full border transition-all duration-200
                         ${isActive
                           ? pip.red ? "bg-red-500 border-red-500" : "bg-slate-700 border-slate-500"
                           : "bg-transparent border-slate-800"}`} />
          );
        })}
      </div>
      <span className={`font-mono text-[11px] font-bold ml-1
                        ${score > 0 ? "text-red-400" : score < 0 ? "text-slate-400" : "text-slate-600"}`}>
        {score > 0 ? `+${score}` : score}
      </span>
    </div>
  );
}

export default function ScoreBoard({ state }) {
  const { playerCount, teamScores, livePoints, currentBid, adjustedTarget, trumpSuit, pairHolder, isDouble } = state;

  if (playerCount !== 4) {
    // Simple live points for 2P/3P
    return (
      <div className="w-full flex items-center justify-center gap-4 flex-wrap font-mono text-[11px]">
        {state.players.map(p => (
          <div key={p.id} className="flex items-center gap-1.5 bg-[#141c26] border border-cyan-500/10
                                     rounded-lg px-3 py-1.5">
            <span className="text-slate-400">{p.name}:</span>
            <span className="text-cyan-400 font-bold">{livePoints[p.id] ?? 0}</span>
          </div>
        ))}
        {currentBid.playerId !== null && (
          <div className="text-amber-400">
            Bid: {currentBid.amount}{adjustedTarget !== currentBid.amount && ` → ${adjustedTarget}`}
          </div>
        )}
      </div>
    );
  }

  const team0Live = livePoints[0] ?? 0;
  const team1Live = livePoints[1] ?? 0;

  return (
    <div className="w-full bg-[#0d1117] border border-cyan-500/10 rounded-xl p-3 flex flex-col gap-2.5">

      {/* Pip score (game-level, persists across rounds) */}
      <div className="flex justify-between flex-wrap gap-2">
        <PipRow score={teamScores[0] ?? 0} label="We" />
        <PipRow score={teamScores[1] ?? 0} label="They" />
      </div>

      <div className="h-px bg-cyan-500/10" />

      {/* Live points this round */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-slate-500 tracking-widest">LIVE</span>
          <span className="font-display font-bold text-cyan-400">{team0Live}</span>
          <span className="font-mono text-[10px] text-slate-600">vs</span>
          <span className="font-display font-bold text-emerald-400">{team1Live}</span>
        </div>

        {/* Bid display */}
        {currentBid.playerId !== null && (
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-slate-500">Bid:</span>
            <span className="text-amber-400 font-bold">{currentBid.amount}</span>
            {adjustedTarget && adjustedTarget !== currentBid.amount && (
              <span className="text-slate-500">
                → <span className="text-amber-400 font-bold">{adjustedTarget}</span>
              </span>
            )}
            {isDouble && <span className="text-red-400">🔥</span>}
          </div>
        )}
      </div>

      {/* Pair indicator */}
      {pairHolder && (
        <div className={`text-center font-mono text-[10px] py-1 rounded-sm
                         ${pairHolder === "bidding"
                           ? "text-emerald-400 bg-emerald-400/8"
                           : "text-red-400 bg-red-400/8"}`}>
          ♛ Pair found! ({pairHolder === "bidding" ? "Bidder's team — target reduced" : "Defenders — target increased"})
        </div>
      )}
    </div>
  );
}
