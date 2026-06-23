// src/pages/Games/Card28/GameEndModal.jsx

export default function GameEndModal({ state, onNewGame, onExit }) {
  const weWon = state.winner === 0;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(8,12,16,0.95)", backdropFilter: "blur(10px)" }}>
      <div className="bg-[#0d1117] border-2 border-cyan-500/30 rounded-2xl p-8 w-full max-w-sm text-center
                      shadow-[0_0_80px_rgba(0,200,255,0.15)]">
        <div className="text-6xl mb-4">{weWon ? "🏆" : "💔"}</div>
        <h2 className={`font-display text-[2rem] font-extrabold mb-2
                        ${weWon ? "text-emerald-400" : "text-red-400"}`}>
          {weWon ? "We Win the Game!" : "They Win the Game"}
        </h2>
        <p className="font-mono text-[12px] text-slate-500 mb-6">
          Final score — We: {state.teamScores[0]} · They: {state.teamScores[1]}
        </p>

        <div className="flex flex-col gap-2">
          <button onClick={onNewGame}
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[13px]
                       tracking-widest py-3 rounded-sm transition-all duration-200
                       hover:shadow-[0_0_20px_rgba(0,200,255,0.4)]">
            Play Again
          </button>
          <button onClick={onExit}
            className="w-full border border-cyan-500/20 text-slate-400 font-mono text-[12px]
                       tracking-widest py-3 rounded-sm hover:border-cyan-400 hover:text-cyan-400
                       transition-all duration-200">
            Exit to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
