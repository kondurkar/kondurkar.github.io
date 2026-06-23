// src/pages/Games/Card28/BiddingPanel.jsx
import { MIN_BID, MAX_BID } from "./gameEngine";

export default function BiddingPanel({ state, isHumanTurn, onBid, onPass, onSetDouble }) {
  const minNext = Math.max(MIN_BID, state.currentBid.amount + 1);

  return (
    <div className="w-full max-w-sm bg-[#141c26] border border-cyan-500/15 rounded-2xl p-5">

      {/* Double / Single toggle — only meaningful for 4P team games */}
      {state.playerCount === 4 && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <button onClick={() => onSetDouble(false)}
            className={`font-mono text-[11px] tracking-widest px-4 py-1.5 rounded-sm border
                        transition-all duration-200
                        ${!state.isDouble
                          ? "bg-cyan-400 text-black border-cyan-400"
                          : "text-slate-500 border-cyan-500/15 hover:border-cyan-400"}`}>
            Single
          </button>
          <button onClick={() => onSetDouble(true)}
            className={`font-mono text-[11px] tracking-widest px-4 py-1.5 rounded-sm border
                        transition-all duration-200
                        ${state.isDouble
                          ? "bg-red-500 text-white border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                          : "text-slate-500 border-cyan-500/15 hover:border-red-400"}`}>
            🔥 Double
          </button>
        </div>
      )}

      <div className="text-center mb-4">
        <p className="font-mono text-[11px] text-slate-500 tracking-widest uppercase mb-1">Bidding Phase</p>
        <p className="font-display text-[1.3rem] font-bold text-slate-100">
          {state.currentBid.playerId !== null
            ? <>Current bid: <span className="text-cyan-400">{state.currentBid.amount}</span> by {state.players[state.currentBid.playerId].name}</>
            : "No bids yet"
          }
        </p>
        {state.isDouble && (
          <p className="font-mono text-[10px] text-red-400 mt-1">Stakes are DOUBLED this round</p>
        )}
      </div>

      {/* Bid history */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-4">
        {state.players.map(p => {
          const bid = state.bids[p.id];
          return (
            <div key={p.id} className={`font-mono text-[10px] px-2.5 py-1 rounded-sm border
                                        ${bid === "pass" ? "text-slate-600 border-slate-700" :
                                          bid ? "text-cyan-400 border-cyan-400/30 bg-cyan-400/8" :
                                          state.biddingTurn === p.id ? "text-amber-400 border-amber-400/30 bg-amber-400/8 animate-pulse" :
                                          "text-slate-700 border-slate-800"}`}>
              {p.name}: {bid === "pass" ? "Pass" : bid ?? "—"}
            </div>
          );
        })}
      </div>

      {isHumanTurn ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: MAX_BID - minNext + 1 }, (_, i) => minNext + i).slice(0, 8).map(amt => (
              <button key={amt} onClick={() => onBid(amt)}
                className="bg-[#1a2535] border border-cyan-500/20 rounded-lg py-2
                           font-mono font-bold text-cyan-400 hover:border-cyan-400
                           hover:bg-[#223045] active:scale-95 transition-all duration-150">
                {amt}
              </button>
            ))}
          </div>
          <button onClick={onPass}
            className="w-full bg-transparent border border-red-500/25 text-red-400
                       font-mono text-[12px] tracking-widest py-2.5 rounded-lg
                       hover:border-red-400 hover:bg-red-400/8 transition-all duration-200">
            Pass
          </button>
        </div>
      ) : (
        <p className="text-center font-mono text-[12px] text-slate-500 animate-pulse">
          Waiting for {state.players[state.biddingTurn]?.name}...
        </p>
      )}
    </div>
  );
}
