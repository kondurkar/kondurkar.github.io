// src/pages/Games/MemoryGame/index.jsx
import { useState, useCallback, useEffect } from "react";
import Board from "./Board";
import Timer from "./Timer";

// ── Emoji sets per difficulty ───────────────────────────────
const EMOJI_SETS = {
  easy:   ["🐶","🐱","🐻","🦊","🐸","🐯"],               // 6 pairs = 12 cards
  medium: ["🐶","🐱","🐻","🦊","🐸","🐯","🦁","🐼","🐨","🦄"],  // 10 pairs = 20 cards  (fixed: was 9)
  hard:   ["🐶","🐱","🐻","🦊","🐸","🐯","🦁","🐼","🐨","🦄",  // 12 pairs = 24 cards
            "🦋","🐬"],
};

const COLS = { easy: 4, medium: 5, hard: 6 };

const DIFFICULTY_LABELS = {
  easy:   { label: "Easy",   pairs: 6,  cls: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"  },
  medium: { label: "Medium", pairs: 10, cls: "text-amber-400   border-amber-400/30   bg-amber-400/10"    },
  hard:   { label: "Hard",   pairs: 12, cls: "text-red-400     border-red-400/30     bg-red-400/10"      },
};

// Shuffle helper
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Build deck: duplicate emojis → assign unique ids
function buildDeck(difficulty) {
  const emojis = EMOJI_SETS[difficulty];
  const pairs  = [...emojis, ...emojis].map((emoji, i) => ({
    id:     i,
    symbol: emoji,
    emoji,
  }));
  return shuffle(pairs);
}

// ── Stats bar ───────────────────────────────────────────────
function StatBox({ label, value, highlight }) {
  return (
    <div className="flex flex-col items-center bg-[#141c26] border border-cyan-500/10 rounded px-5 py-3 min-w-[80px]">
      <span className={`font-mono text-[1.2rem] font-bold tabular-nums ${highlight ?? "text-cyan-400"}`}>
        {value}
      </span>
      <span className="font-mono text-[10px] text-slate-600 tracking-widest uppercase mt-0.5">
        {label}
      </span>
    </div>
  );
}

// ── Win modal ───────────────────────────────────────────────
function WinModal({ moves, elapsed, difficulty, onReplay, onChangeDifficulty }) {
  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");

  const rating = moves <= EMOJI_SETS[difficulty].length * 2
    ? { stars: "⭐⭐⭐", msg: "Perfect memory!" }
    : moves <= EMOJI_SETS[difficulty].length * 3
    ? { stars: "⭐⭐",   msg: "Great job!"      }
    : { stars: "⭐",    msg: "Keep practicing!" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(8,12,16,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="bg-[#0d1117] border border-cyan-500/20 rounded-lg p-8 max-w-sm w-full text-center
                      shadow-[0_0_60px_rgba(0,200,255,0.1)]">

        <div className="text-4xl mb-3">🎉</div>
        <h2 className="font-display text-[1.8rem] font-extrabold text-slate-100 mb-1">You Won!</h2>
        <p className="font-mono text-[13px] text-slate-500 mb-6">All pairs matched</p>

        <div className="text-2xl mb-4 tracking-widest">{rating.stars}</div>
        <p className="font-mono text-[12px] text-cyan-400 mb-6">{rating.msg}</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-[#141c26] border border-cyan-500/10 rounded p-3">
            <div className="font-mono text-[1.4rem] font-bold text-cyan-400">{moves}</div>
            <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mt-0.5">Moves</div>
          </div>
          <div className="bg-[#141c26] border border-cyan-500/10 rounded p-3">
            <div className="font-mono text-[1.4rem] font-bold text-cyan-400">{mins}:{secs}</div>
            <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mt-0.5">Time</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={onReplay}
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[13px]
                       tracking-widest py-3 rounded-sm transition-all duration-200
                       hover:shadow-[0_0_20px_rgba(0,200,255,0.4)]">
            Play Again
          </button>
          <button onClick={onChangeDifficulty}
            className="w-full bg-transparent border border-cyan-500/25 text-cyan-400
                       font-mono text-[13px] tracking-widest py-3 rounded-sm
                       transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-500/6">
            Change Difficulty
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Game ───────────────────────────────────────────────
export default function MemoryGame() {
  const [difficulty,  setDifficulty]  = useState(null);   // null = difficulty screen
  const [cards,       setCards]       = useState([]);
  const [flipped,     setFlipped]     = useState([]);      // card ids currently face-up
  const [matched,     setMatched]     = useState([]);      // matched symbols
  const [moves,       setMoves]       = useState(0);
  const [elapsed,     setElapsed]     = useState(0);
  const [timerOn,     setTimerOn]     = useState(false);
  const [locked,      setLocked]      = useState(false);   // prevent clicking during check
  const [won,         setWon]         = useState(false);

  const totalPairs = difficulty ? EMOJI_SETS[difficulty].length : 0;

  // Init game
  const startGame = useCallback((diff) => {
    setDifficulty(diff);
    setCards(buildDeck(diff));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setElapsed(0);
    setTimerOn(false);
    setLocked(false);
    setWon(false);
  }, []);

  // Timer tick
  const handleTick = useCallback(() => setElapsed(e => e + 1), []);

  // Card click
  const handleCardClick = useCallback((card) => {
    if (locked) return;
    if (matched.includes(card.symbol)) return;
    if (flipped.includes(card.id)) return;
    if (flipped.length === 2) return;

    // Start timer on first flip
    if (!timerOn) setTimerOn(true);

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);

      const [firstId, secondId] = newFlipped;
      const firstCard  = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard.symbol === secondCard.symbol) {
        // Match!
        const newMatched = [...matched, firstCard.symbol];
        setMatched(newMatched);
        setFlipped([]);
        setLocked(false);

        // Win check
        if (newMatched.length === EMOJI_SETS[difficulty].length) {
          setTimerOn(false);
          setWon(true);
        }
      } else {
        // No match — flip back after delay
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [locked, matched, flipped, timerOn, cards, difficulty]);

  // ── Difficulty picker screen ───────────────────────────
  if (!difficulty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="text-5xl mb-4">🃏</div>
        <h1 className="font-display text-[2rem] font-extrabold text-slate-100 mb-2">
          Memory Card Game
        </h1>
        <p className="font-mono text-[13px] text-slate-500 mb-12 text-center max-w-sm">
          Flip cards to find matching pairs. Train your memory!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
          {Object.entries(DIFFICULTY_LABELS).map(([key, { label, pairs, cls }]) => (
            <button key={key} onClick={() => startGame(key)}
              className={`flex flex-col items-center gap-2 bg-[#141c26] border rounded-lg p-6
                          transition-all duration-200 hover:-translate-y-1
                          hover:shadow-[0_0_20px_rgba(0,200,255,0.15)] ${cls}`}>
              <span className="font-display text-[1.2rem] font-bold">{label}</span>
              <span className="font-mono text-[11px] opacity-70">{pairs} pairs</span>
              <span className="font-mono text-[11px] opacity-70">{pairs * 2} cards</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Game screen ────────────────────────────────────────
  const diffMeta = DIFFICULTY_LABELS[difficulty];

  return (
    <div className="flex flex-col items-center gap-6 pb-16">

      {/* Header */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🃏</span>
            <h1 className="font-display text-[1.4rem] font-bold text-slate-100">Memory Game</h1>
            <span className={`font-mono text-[11px] border px-2.5 py-1 rounded-sm tracking-wide ${diffMeta.cls}`}>
              {diffMeta.label}
            </span>
          </div>
          <button onClick={() => setDifficulty(null)}
            className="font-mono text-[12px] text-slate-500 hover:text-cyan-400
                       transition-colors duration-200">
            ← Change difficulty
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <StatBox label="Moves"   value={moves} />
        <StatBox label="Matched" value={`${matched.length}/${totalPairs}`}
          highlight={matched.length === totalPairs ? "text-emerald-400" : "text-cyan-400"} />
        <Timer isRunning={timerOn} elapsed={elapsed} onTick={handleTick} />
        <button onClick={() => startGame(difficulty)}
          className="font-mono text-[11px] text-slate-500 border border-cyan-500/15
                     px-4 py-2 rounded-sm hover:border-cyan-400 hover:text-cyan-400
                     transition-all duration-200 tracking-widest">
          ↺ Restart
        </button>
      </div>

      {/* Board */}
      <div className="w-full max-w-2xl">
        <Board
          cards={cards}
          flipped={flipped}
          matched={matched}
          onCardClick={handleCardClick}
          cols={COLS[difficulty]}
        />
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-between font-mono text-[11px] text-slate-600 mb-1.5">
          <span>Progress</span>
          <span>{matched.length}/{totalPairs} pairs</span>
        </div>
        <div className="h-1.5 bg-[#141c26] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${totalPairs > 0 ? (matched.length / totalPairs) * 100 : 0}%`,
              background: "linear-gradient(90deg, #00c8ff, #00ff9d)",
            }}
          />
        </div>
      </div>

      {/* Win modal */}
      {won && (
        <WinModal
          moves={moves}
          elapsed={elapsed}
          difficulty={difficulty}
          onReplay={() => startGame(difficulty)}
          onChangeDifficulty={() => setDifficulty(null)}
        />
      )}
    </div>
  );
}
