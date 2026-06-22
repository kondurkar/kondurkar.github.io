// src/pages/Games/Card28/index.jsx
import { useState } from "react";
import { useGame28 } from "./useGame28";
import { PHASES } from "./gameEngine";
import PlayingCard from "./Card";
import PlayerSeat from "./PlayerSeat";
import TrickArea from "./TrickArea";
import BiddingPanel from "./BiddingPanel";
import TrumpPicker from "./TrumpPicker";
import RoundEndModal from "./RoundEndModal";

// ── Mode picker ──────────────────────────────────────────────
function ModePicker({ onStart }) {
  const MODES = [
    { count: 4, label: "4 Players", sub: "2v2 Teams · vs 3 Bots", emoji: "👥👥" },
    { count: 3, label: "3 Players", sub: "Free-for-all · vs 2 Bots", emoji: "👤👤👤" },
    { count: 2, label: "2 Players", sub: "Head to head · vs 1 Bot",  emoji: "👤👤" },
  ];
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🃏</div>
        <h1 className="font-display text-[2.5rem] font-extrabold text-slate-100 mb-2">28</h1>
        <p className="font-mono text-[13px] text-slate-500 max-w-xs text-center">
          The classic South Indian trick-taking card game. Bid, pick trump, and win tricks.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
        {MODES.map(m => (
          <button key={m.count} onClick={() => onStart(m.count)}
            className="flex flex-col items-center gap-2 bg-[#141c26] border border-cyan-500/20
                       rounded-2xl p-6 hover:border-cyan-400 hover:bg-[#1a2535]
                       transition-all duration-200 hover:-translate-y-1">
            <span className="text-2xl">{m.emoji}</span>
            <span className="font-display font-bold text-slate-100">{m.label}</span>
            <span className="font-mono text-[10px] text-slate-500 text-center">{m.sub}</span>
          </button>
        ))}
      </div>
      <p className="font-mono text-[10px] text-slate-700 text-center max-w-xs">
        🔧 Pass-and-play and online multiplayer modes coming soon — built on the same game engine.
      </p>
    </div>
  );
}

// ── Rules accordion ──────────────────────────────────────────
function RulesPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full max-w-sm">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between font-mono text-[11px]
                   text-slate-500 hover:text-cyan-400 transition-colors py-2">
        <span>📖 How to play</span>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="bg-[#141c26] border border-cyan-500/10 rounded-lg p-4
                        font-mono text-[11px] text-slate-500 leading-relaxed space-y-2">
          <p><strong className="text-cyan-400">Cards:</strong> 32 cards (7–A in each suit). J=3pts, 9=2pts, A=1pt, 10=1pt. Total = 28 points.</p>
          <p><strong className="text-cyan-400">Bidding:</strong> Starting from 16, players bid how many points they'll win. Highest bidder picks trump.</p>
          <p><strong className="text-cyan-400">Rank order:</strong> J &gt; 9 &gt; A &gt; 10 &gt; K &gt; Q &gt; 8 &gt; 7 (within a suit).</p>
          <p><strong className="text-cyan-400">Playing:</strong> Follow the lead suit if you can. Trump beats everything else.</p>
          <p><strong className="text-cyan-400">Winning:</strong> The bidder's team must collect at least their bid amount in points.</p>
        </div>
      )}
    </div>
  );
}

// ── Main game screen ──────────────────────────────────────────
function GameScreen({ playerCount, onExit }) {
  const { state, humanHand, legalMoves, isHumanTurn, isHumanBidTurn,
          isHumanTrumpPick, actions } = useGame28(playerCount, "You");

  const seatPositions = {
    4: { 1: "left", 2: "top", 3: "right" },
    3: { 1: "left", 2: "right" },
    2: { 1: "top" },
  }[playerCount];

  return (
    <div className="flex flex-col items-center gap-4 pb-8 max-w-2xl mx-auto px-2 w-full">

      {/* Header */}
      <div className="w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <span className="text-xl">🃏</span>
          <h1 className="font-display text-[1.2rem] font-extrabold text-slate-100">28</h1>
          <span className="font-mono text-[10px] text-slate-500 border border-cyan-500/15
                           px-2 py-0.5 rounded-sm">{playerCount}P</span>
        </div>
        <div className="flex items-center gap-3">
          {state.trumpSuit && (
            <span className="font-mono text-[11px] text-cyan-400">
              Trump: <span className="text-base">{state.trumpSuit}</span>
            </span>
          )}
          <button onClick={onExit}
            className="font-mono text-[11px] text-slate-600 hover:text-red-400 transition-colors">
            ✕ Exit
          </button>
        </div>
      </div>

      {/* Opponent seats (top/left/right) */}
      {(playerCount === 4 || playerCount === 3) && (
        <div className="w-full flex justify-center">
          <PlayerSeat
            player={state.players[seatPositions[2] ? 2 : 1]}
            position="top"
            isCurrentTurn={state.currentTurn === (seatPositions[2] ? 2 : 1) || state.biddingTurn === (seatPositions[2] ? 2 : 1)}
            isDealer={state.dealerIndex === (seatPositions[2] ? 2 : 1)}
            isTrumpCaller={state.trumpCaller === (seatPositions[2] ? 2 : 1)}
            cardCount={state.players[seatPositions[2] ? 2 : 1]?.hand.length ?? 0}
          />
        </div>
      )}

      <div className="w-full flex items-center justify-between gap-2">
        {/* Left seat */}
        {state.players[1] && playerCount >= 3 ? (
          <PlayerSeat player={state.players[1]} position="left"
            isCurrentTurn={state.currentTurn === 1 || state.biddingTurn === 1}
            isDealer={state.dealerIndex === 1} isTrumpCaller={state.trumpCaller === 1}
            cardCount={state.players[1].hand.length} />
        ) : playerCount === 2 ? (
          <PlayerSeat player={state.players[1]} position="left"
            isCurrentTurn={state.currentTurn === 1 || state.biddingTurn === 1}
            isDealer={state.dealerIndex === 1} isTrumpCaller={state.trumpCaller === 1}
            cardCount={state.players[1].hand.length} />
        ) : <div />}

        {/* Trick area */}
        <div className="flex-1 max-w-md">
          <TrickArea trick={state.currentTrick} playerCount={playerCount} trumpSuit={state.trumpSuit} />
        </div>

        {/* Right seat (4P/3P only) */}
        {playerCount === 4 ? (
          <PlayerSeat player={state.players[3]} position="right"
            isCurrentTurn={state.currentTurn === 3 || state.biddingTurn === 3}
            isDealer={state.dealerIndex === 3} isTrumpCaller={state.trumpCaller === 3}
            cardCount={state.players[3].hand.length} />
        ) : playerCount === 3 ? (
          <PlayerSeat player={state.players[2]} position="right"
            isCurrentTurn={state.currentTurn === 2 || state.biddingTurn === 2}
            isDealer={state.dealerIndex === 2} isTrumpCaller={state.trumpCaller === 2}
            cardCount={state.players[2].hand.length} />
        ) : <div />}
      </div>

      {/* Bidding panel */}
      {state.phase === PHASES.BIDDING && (
        <BiddingPanel state={state} isHumanTurn={isHumanBidTurn}
          onBid={actions.placeBid} onPass={actions.passBid} />
      )}

      {/* Trump picker */}
      {state.phase === PHASES.TRUMP_PICK && isHumanTrumpPick && (
        <TrumpPicker onPick={actions.pickTrump} />
      )}
      {state.phase === PHASES.TRUMP_PICK && !isHumanTrumpPick && (
        <div className="font-mono text-[12px] text-slate-500 animate-pulse">
          {state.players[state.trumpCaller]?.name} is choosing trump...
        </div>
      )}

      {/* Your hand */}
      <div className="w-full mt-2">
        <p className="font-mono text-[10px] text-slate-600 tracking-widest uppercase mb-2 text-center">
          Your Hand {isHumanTurn && <span className="text-cyan-400">— Your Turn</span>}
        </p>
        <div className="flex justify-center gap-1.5 flex-wrap">
          {humanHand.map(card => (
            <PlayingCard
              key={card.id}
              card={card}
              disabled={!isHumanTurn || (legalMoves.length > 0 && !legalMoves.includes(card.id))}
              onClick={() => actions.playCard(card)}
            />
          ))}
        </div>
      </div>

      {/* Game log */}
      <div className="w-full max-h-20 overflow-y-auto bg-[#0d1117] border border-cyan-500/10
                      rounded-lg p-2 font-mono text-[10px] text-slate-600">
        {state.gameLog.slice(-4).map((msg, i) => <div key={i}>{msg}</div>)}
      </div>

      <RulesPanel />

      {/* Round end modal */}
      {state.phase === PHASES.ROUND_END && (
        <RoundEndModal state={state} onNextRound={actions.nextRound} onNewGame={onExit} />
      )}
    </div>
  );
}

// ── Top-level export ───────────────────────────────────────────
export default function Card28() {
  const [playerCount, setPlayerCount] = useState(null);

  if (!playerCount) return <ModePicker onStart={setPlayerCount} />;
  return <GameScreen playerCount={playerCount} onExit={() => setPlayerCount(null)} />;
}