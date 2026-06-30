// src/pages/Games/Card28/ScoreBoard.jsx
//
// Score display modeled on traditional 28/29 card-game scoring:
// each side's score is shown as a stack of six-cards.
//   We (team 0):   ♥ six = positive,  ♠ six = negative
//   They (team 1): ♦ six = positive,  ♣ six = negative
// Only ONE suit shows per side at a time (you're either in red-pip
// territory or black-pip territory) — pip count = |score|.

const SIDE_CONFIG = {
  we:   { label: "We",   posSuit: "♥", negSuit: "♠", posColor: "text-red-500",  negColor: "text-slate-200" },
  they: { label: "They", posSuit: "♦", negSuit: "♣", posColor: "text-red-500",  negColor: "text-slate-200" },
};

// A single mini six-card showing N pips of its suit
function SixCard({ suit, pipCount, isRed, dim }) {
  return (
    <div className={`relative w-12 h-16 sm:w-14 sm:h-[4.5rem] rounded-md bg-[#f7f4ec] border-2
                     flex flex-col items-center justify-between p-1 shrink-0 transition-all duration-300
                     ${dim ? "opacity-30" : "opacity-100"}
                     ${isRed ? "border-red-300" : "border-slate-400"}`}>
      <span className={`font-display font-extrabold text-[10px] leading-none self-start
                        ${isRed ? "text-red-500" : "text-slate-700"}`}>
        6{suit}
      </span>

      {/* Pip grid — up to 6 pips, 2 cols x 3 rows like a real six-card */}
      <div className="grid grid-cols-2 gap-0.5 flex-1 items-center">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i}
            className={`text-[9px] sm:text-[11px] leading-none transition-opacity duration-300
                       ${isRed ? "text-red-500" : "text-slate-700"}
                       ${i < pipCount ? "opacity-100" : "opacity-0"}`}>
            {suit}
          </span>
        ))}
      </div>

      <span className={`font-display font-extrabold text-[10px] leading-none self-end rotate-180
                        ${isRed ? "text-red-500" : "text-slate-700"}`}>
        6{suit}
      </span>
    </div>
  );
}

// One side's full score display: shows whichever six-card is "active"
// (positive suit if score >= 0, negative suit if score < 0), with the
// pip count reflecting |score|. The inactive suit sits behind, dimmed.
function SideScore({ side, score }) {
  const cfg = SIDE_CONFIG[side];
  const isPositive = score >= 0;
  const pipCount = Math.min(6, Math.abs(score));

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">{cfg.label}</span>
      <div className="relative flex items-center justify-center">
        {/* Stack visual: dimmed inactive card behind, active card on top */}
        <div className="absolute -translate-x-1 -translate-y-1 opacity-0 sm:opacity-100">
          <SixCard suit={isPositive ? cfg.negSuit : cfg.posSuit} pipCount={0} isRed={false} dim />
        </div>
        <SixCard
          suit={isPositive ? cfg.posSuit : cfg.negSuit}
          pipCount={pipCount}
          isRed={isPositive}
        />
      </div>
      <span className={`font-mono text-[12px] font-bold ${isPositive ? "text-red-400" : "text-slate-400"}`}>
        {score > 0 ? `+${score}` : score}
      </span>
    </div>
  );
}

export default function ScoreBoard({ state }) {
  const {
    playerCount, teamScores, livePoints, currentBid, adjustedTarget,
    trumpStyle, trumpRevealed, pairHolder, isDouble, tricksPlayedSinceTrumpHidden,
  } = state;

  const safeAdjustedTarget = trumpRevealed ? adjustedTarget : currentBid.amount;
  const safePairHolder      = trumpRevealed ? pairHolder : null;

  if (playerCount !== 4) {
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
          <div className="text-amber-400">Bid: {currentBid.amount}</div>
        )}
      </div>
    );
  }

  // teamScores[0] = "We", teamScores[1] = "They"
  const weScore   = teamScores[0] ?? 0;
  const theyScore = teamScores[1] ?? 0;
  const team0Live = livePoints[0] ?? 0;
  const team1Live = livePoints[1] ?? 0;

  // Bidding team label — whichever team the trumpCaller belongs to
  const callerTeam = state.players[state.trumpCaller]?.team;
  const biddingTeamLabel = callerTeam === 0 ? "We" : callerTeam === 1 ? "They" : null;

  return (
    <div className="w-full bg-[#0d1117] border border-cyan-500/10 rounded-xl p-3 flex flex-col gap-3">

      {/* Six-card score display */}
      <div className="flex justify-center gap-8 sm:gap-12">
        <SideScore side="we" score={weScore} />
        <SideScore side="they" score={theyScore} />
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
            {biddingTeamLabel && (
              <span className="text-slate-500">{biddingTeamLabel} bid:</span>
            )}
            <span className="text-amber-400 font-bold">{currentBid.amount}</span>
            {safeAdjustedTarget !== currentBid.amount && (
              <span className="text-slate-500">
                → <span className="text-amber-400 font-bold">{safeAdjustedTarget}</span>
              </span>
            )}
            {isDouble && <span className="text-red-400">🔥</span>}
            {trumpStyle === "closed" && (
              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-sm
                                ${trumpRevealed
                                  ? "text-emerald-400 bg-emerald-400/10"
                                  : "text-amber-500 bg-amber-500/10"}`}>
                {trumpRevealed ? "🔓 Exposed" : "🔒 Closed"}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Closed-trump countdown */}
      {trumpStyle === "closed" && !trumpRevealed && (
        <div className="text-center font-mono text-[10px] text-amber-500/80 bg-amber-500/8 rounded-sm py-1">
          ⏳ Trump hidden — must be exposed within {7 - tricksPlayedSinceTrumpHidden} more trick
          {7 - tricksPlayedSinceTrumpHidden !== 1 ? "s" : ""}, or the round is invalid
        </div>
      )}

      {/* Pair indicator */}
      {safePairHolder && (
        <div className={`text-center font-mono text-[10px] py-1 rounded-sm
                         ${safePairHolder === "bidding"
                           ? "text-emerald-400 bg-emerald-400/8"
                           : "text-red-400 bg-red-400/8"}`}>
          ♛ Pair found! ({safePairHolder === "bidding" ? "Bidding team — target reduced" : "Opposing team — target increased"})
        </div>
      )}
    </div>
  );
}
