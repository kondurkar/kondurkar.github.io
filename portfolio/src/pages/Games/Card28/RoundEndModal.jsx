// src/pages/Games/Card28/RoundEndModal.jsx

export default function RoundEndModal({ state, onNextRound, onNewGame }) {
  const result = state.lastResult;
  if (!result) return null;

  const is4Player = state.playerCount === 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(8,12,16,0.9)", backdropFilter: "blur(8px)" }}>
      <div className="bg-[#0d1117] border border-cyan-500/20 rounded-2xl p-6 w-full max-w-sm text-center
                      shadow-[0_0_60px_rgba(0,200,255,0.08)]">

        <div className="text-4xl mb-2">{result.bidMade ? "🎉" : "😬"}</div>
        <h2 className={`font-display text-[1.6rem] font-extrabold mb-1
                        ${result.bidMade ? "text-emerald-400" : "text-red-400"}`}>
          {result.bidMade ? "Bid Made!" : "Bid Failed"}
        </h2>

        {is4Player ? (
          <div className="my-4">
            <p className="font-mono text-[12px] text-slate-500 mb-3">
              Bid: {result.bidAmount} by Team {result.callerTeam}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#141c26] border border-cyan-500/10 rounded-lg p-3">
                <div className="font-display font-extrabold text-cyan-400 text-xl">{result.team0Points}</div>
                <div className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">Team 0</div>
              </div>
              <div className="bg-[#141c26] border border-cyan-500/10 rounded-lg p-3">
                <div className="font-display font-extrabold text-emerald-400 text-xl">{result.team1Points}</div>
                <div className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">Team 1</div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div>
                <div className="font-display font-extrabold text-slate-100 text-2xl">{state.teamScores[0] ?? 0}</div>
                <div className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">Rounds Won (T0)</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-slate-100 text-2xl">{state.teamScores[1] ?? 0}</div>
                <div className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">Rounds Won (T1)</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="my-4">
            <p className="font-mono text-[12px] text-slate-500 mb-3">
              Bid: {result.bidAmount} by {state.players[result.caller].name}
            </p>
            <div className="flex flex-col gap-2">
              {Object.entries(result.playerPoints).map(([pid, pts]) => (
                <div key={pid} className="flex justify-between bg-[#141c26] border border-cyan-500/10
                                          rounded-lg px-4 py-2">
                  <span className="font-mono text-[12px] text-slate-400">{state.players[pid].name}</span>
                  <span className="font-mono font-bold text-cyan-400">{pts} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-4">
          <button onClick={onNextRound}
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[12px]
                       tracking-widest py-3 rounded-sm transition-all duration-200">
            Next Round →
          </button>
          <button onClick={onNewGame}
            className="w-full border border-cyan-500/20 text-slate-400 font-mono text-[12px]
                       tracking-widest py-3 rounded-sm hover:border-cyan-400 hover:text-cyan-400
                       transition-all duration-200">
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}