// src/pages/Games/Card28/index.jsx
import { useState } from "react";
import { useGame28 } from "./useGame28";
import { PHASES } from "./gameEngine";
import { checkRoundCertainty } from "./roundCertainty";
import PlayingCard from "./Card";
import PlayerSeat from "./PlayerSeat";
import TrickArea from "./TrickArea";
import BiddingPanel from "./BiddingPanel";
import TrumpPicker, { TrumpStylePicker } from "./TrumpPicker";
import RoundEndModal from "./RoundEndModal";
import GameEndModal from "./GameEndModal";
import CancelledModal from "./CancelledModal";
import ScoreBoard from "./ScoreBoard";

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
          Play Open or Closed trump — your choice each round.
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
          <p><strong className="text-cyan-400">Open trump:</strong> The bidder reveals the trump suit to everyone immediately.</p>
          <p><strong className="text-cyan-400">Closed trump:</strong> The bidder keeps trump hidden. The bidder can't lead trump unless forced. If you can't follow suit, you may discard safely (it can never win) — or call for trump to be exposed, after which you must play trump if you have one. Trump must be exposed within 7 tricks or the round is invalid.</p>
          <p><strong className="text-cyan-400">Pair (K+Q of trump):</strong> If the bidder's team has it, their target drops by 4. If defenders have it, the target rises by 4.</p>
          <p><strong className="text-cyan-400">Game points:</strong> 1 normally, 2 for bids of 21+, 3 for a Full House (winning all 28 points). Failing by more than half doubles the penalty.</p>
          <p><strong className="text-cyan-400">Double:</strong> Doubles all game points won/lost this round.</p>
          <p><strong className="text-cyan-400">Winning the game:</strong> First team to reach +6 (or opponent reaches −6) wins.</p>
          <p><strong className="text-cyan-400">Cancelled rounds:</strong> Redealt if a hand has zero point-cards, a full team has no trump, or closed trump is never exposed in time.</p>
        </div>
      )}
    </div>
  );
}

// ── Main game screen ──────────────────────────────────────────
function GameScreen({ playerCount, onExit }) {
  const { state, displayTrick, humanHand, legalMoves, isHumanTurn, isHumanBidTurn,
          isHumanTrumpStyle, isHumanTrumpPick, canHumanCallExpose, actions } =
    useGame28(playerCount, "You");

  const certainty = state.phase === PHASES.PLAYING ? checkRoundCertainty(state) : { isCertain: false };

  const seatPositions = {
    4: { 1: "left", 2: "top", 3: "right" },
    3: { 1: "left", 2: "right" },
    2: { 1: "top" },
  }[playerCount];

  // Trump display in header: only show once genuinely revealed (open trump =
  // immediate; closed trump = only after CALL_EXPOSE). Never read trumpSuit
  // directly elsewhere in the UI before this gate.
  const trumpKnownToUser = state.trumpSuit && state.trumpRevealed;

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
          {trumpKnownToUser && (
            <span className="font-mono text-[11px] text-cyan-400">
              Trump: <span className="text-base">{state.trumpSuit}</span>
            </span>
          )}
          {state.trumpStyle === "closed" && !state.trumpRevealed && (
            <span className="font-mono text-[10px] text-amber-500 flex items-center gap-1">
              🔒 Closed
            </span>
          )}
          <button onClick={onExit}
            className="font-mono text-[11px] text-slate-600 hover:text-red-400 transition-colors">
            ✕ Exit
          </button>
        </div>
      </div>

      {/* Live scoreboard — shows during bidding, trump-pick, and play */}
      {state.phase !== PHASES.GAME_END && state.phase !== PHASES.CANCELLED && (
        <ScoreBoard state={state} />
      )}

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
        {state.players[1] && playerCount >= 2 ? (
          <PlayerSeat player={state.players[1]} position="left"
            isCurrentTurn={state.currentTurn === 1 || state.biddingTurn === 1}
            isDealer={state.dealerIndex === 1} isTrumpCaller={state.trumpCaller === 1}
            cardCount={state.players[1].hand.length} />
        ) : <div />}

        {/* Trick area — uses displayTrick so the last bot's card is visible before clearing */}
        <div className="flex-1 max-w-md">
          <TrickArea
            trick={displayTrick}
            playerCount={playerCount}
            trumpSuit={state.trumpSuit}
            trumpStyle={state.trumpStyle}
            trumpRevealed={state.trumpRevealed}
          />
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

      {/* Call for trump exposure — closed trump, can't follow suit */}
      {canHumanCallExpose && (
        <div className="w-full max-w-sm bg-amber-500/8 border border-amber-500/25 rounded-xl p-3 text-center">
          <p className="font-mono text-[11px] text-amber-400 mb-2">
            You can't follow suit. Discard safely, or call to expose the hidden trump.
          </p>
          <button onClick={actions.callExpose}
            className="bg-amber-500 hover:bg-amber-400 text-black font-mono text-[12px]
                       tracking-widest px-6 py-2 rounded-sm transition-all duration-200">
            🔓 Call for Trump Exposure
          </button>
        </div>
      )}

      {/* Claim round — appears once outcome is mathematically certain */}
      {certainty.isCertain && (
        <div className="w-full max-w-sm bg-amber-400/10 border border-amber-400/30 rounded-xl p-4 text-center">
          <p className="font-mono text-[11px] text-amber-400 mb-2">
            {certainty.outcome === "won" ? "✅" : "❌"} {certainty.reason}
          </p>
          <button onClick={actions.claimRound}
            className="bg-amber-400 hover:bg-amber-300 text-black font-mono text-[12px]
                       tracking-widest px-6 py-2.5 rounded-sm transition-all duration-200">
            Skip to Result →
          </button>
        </div>
      )}

      {/* Bidding panel */}
      {state.phase === PHASES.BIDDING && (
        <BiddingPanel state={state} isHumanTurn={isHumanBidTurn}
          onBid={actions.placeBid} onPass={actions.passBid} onSetDouble={actions.setDouble} />
      )}

      {/* Trump style choice (Open vs Closed) */}
      {state.phase === PHASES.TRUMP_STYLE && isHumanTrumpStyle && (
        <TrumpStylePicker onChoose={actions.chooseTrumpStyle} />
      )}
      {state.phase === PHASES.TRUMP_STYLE && !isHumanTrumpStyle && (
        <div className="font-mono text-[12px] text-slate-500 animate-pulse">
          {state.players[state.trumpCaller]?.name} is deciding Open or Closed trump...
        </div>
      )}

      {/* Trump suit picker */}
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

      {/* Game end modal — a team reached +6 or -6 */}
      {state.phase === PHASES.GAME_END && (
        <GameEndModal state={state} onNewGame={actions.resetGame} onExit={onExit} />
      )}

      {/* Cancelled round modal */}
      {state.phase === PHASES.CANCELLED && (
        <CancelledModal reason={state.cancelReason} onAcknowledge={actions.acknowledgeCancel} />
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
