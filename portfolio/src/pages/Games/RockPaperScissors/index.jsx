// src/pages/Games/RockPaperScissors/index.jsx
import { useState, useCallback } from "react";

const CHOICES = ["rock", "paper", "scissors"];
const EMOJI   = { rock: "🪨", paper: "📄", scissors: "✂️" };
const BEATS   = { rock: "scissors", paper: "rock", scissors: "paper" };

function getResult(player, cpu) {
  if (player === cpu) return "draw";
  return BEATS[player] === cpu ? "win" : "lose";
}

const RESULT_STYLE = {
  win:  { label: "You Win! 🎉", cls: "text-emerald-400 border-emerald-400/30 bg-emerald-400/8" },
  lose: { label: "CPU Wins 🤖", cls: "text-red-400 border-red-400/30 bg-red-400/8"           },
  draw: { label: "Draw! 🤝",    cls: "text-amber-400 border-amber-400/30 bg-amber-400/8"      },
};

const ROUNDS = [3, 5, 7];

export default function RockPaperScissors() {
  const [scores,      setScores]      = useState({ player: 0, cpu: 0, draw: 0 });
  const [history,     setHistory]     = useState([]);
  const [cpuChoice,   setCpuChoice]   = useState(null);
  const [playerChoice,setPlayerChoice]= useState(null);
  const [result,      setResult]      = useState(null);
  const [animating,   setAnimating]   = useState(false);
  const [maxRounds,   setMaxRounds]   = useState(5);
  const [gameOver,    setGameOver]    = useState(false);

  const totalPlayed = scores.player + scores.cpu + scores.draw;
  const winner = gameOver
    ? scores.player > scores.cpu ? "You" : scores.cpu > scores.player ? "CPU" : "Nobody"
    : null;

  const play = useCallback((choice) => {
    if (animating || gameOver) return;
    setAnimating(true);
    setPlayerChoice(choice);
    setCpuChoice(null);
    setResult(null);

    setTimeout(() => {
      const cpu    = CHOICES[Math.floor(Math.random() * 3)];
      const res    = getResult(choice, cpu);
      setCpuChoice(cpu);
      setResult(res);
      setHistory(h => [{ player: choice, cpu, result: res }, ...h.slice(0, 11)]);
      setScores(s => ({
        ...s,
        ...(res === "win"  ? { player: s.player + 1 } : {}),
        ...(res === "lose" ? { cpu:    s.cpu    + 1 } : {}),
        ...(res === "draw" ? { draw:   s.draw   + 1 } : {}),
      }));

      // Check if series over
      const newPlayer = res === "win"  ? scores.player + 1 : scores.player;
      const newCpu    = res === "lose" ? scores.cpu    + 1 : scores.cpu;
      const needed    = Math.ceil(maxRounds / 2);
      if (newPlayer >= needed || newCpu >= needed) setGameOver(true);

      setAnimating(false);
    }, 600);
  }, [animating, gameOver, scores, maxRounds]);

  const reset = () => {
    setScores({ player: 0, cpu: 0, draw: 0 });
    setHistory([]);
    setCpuChoice(null);
    setPlayerChoice(null);
    setResult(null);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center gap-7 pb-16">

      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">✂️</span>
        <h1 className="font-display text-[1.8rem] font-extrabold text-slate-100">Rock Paper Scissors</h1>
      </div>

      {/* Rounds selector */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] text-slate-500 tracking-widest">BEST OF</span>
        {ROUNDS.map(r => (
          <button key={r} onClick={() => { setMaxRounds(r); reset(); }}
            className={`font-mono text-[12px] w-10 h-8 rounded-sm border transition-all
                        ${maxRounds === r
                          ? "bg-cyan-400 text-black border-cyan-400"
                          : "text-slate-500 border-cyan-500/15 hover:border-cyan-400"}`}>
            {r}
          </button>
        ))}
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {[
          { key: "player", label: "You",  color: "text-cyan-400"    },
          { key: "draw",   label: "Draw", color: "text-slate-500"   },
          { key: "cpu",    label: "CPU",  color: "text-emerald-400" },
        ].map(({ key, label, color }) => (
          <div key={key} className="flex flex-col items-center bg-[#141c26]
                                    border border-cyan-500/10 rounded-lg py-3">
            <span className={`font-display text-[2rem] font-extrabold ${color}`}>
              {scores[key]}
            </span>
            <span className="font-mono text-[10px] text-slate-600 tracking-widest uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Arena */}
      <div className="flex items-center justify-center gap-6 w-full max-w-xs">
        {/* Player */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] text-cyan-400 tracking-widest uppercase">You</span>
          <div className={`w-20 h-20 rounded-2xl bg-[#141c26] border flex items-center justify-center
                           text-4xl transition-all duration-300
                           ${playerChoice ? "border-cyan-400/50 scale-100" : "border-cyan-500/15 scale-95"}`}>
            {playerChoice ? EMOJI[playerChoice] : "❓"}
          </div>
        </div>

        <div className="font-display font-extrabold text-slate-600 text-xl">VS</div>

        {/* CPU */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase">CPU</span>
          <div className={`w-20 h-20 rounded-2xl bg-[#141c26] border flex items-center justify-center
                           text-4xl transition-all duration-300
                           ${cpuChoice ? "border-emerald-400/50 scale-100" : "border-cyan-500/15 scale-95"}`}>
            {animating ? "🤔" : cpuChoice ? EMOJI[cpuChoice] : "❓"}
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className={`font-mono text-[14px] tracking-widest px-6 py-3 rounded-sm border
                         ${RESULT_STYLE[result].cls}`}>
          {RESULT_STYLE[result].label}
        </div>
      )}

      {/* Game over */}
      {gameOver && (
        <div className="text-center bg-[#141c26] border border-cyan-500/20 rounded-xl p-6 w-full max-w-xs">
          <div className="text-4xl mb-2">{winner === "You" ? "🏆" : winner === "CPU" ? "🤖" : "🤝"}</div>
          <p className="font-display font-bold text-slate-100 text-xl mb-1">{winner} Win{winner !== "Nobody" ? "s" : ""}!</p>
          <p className="font-mono text-[12px] text-slate-500 mb-4">{scores.player} – {scores.cpu}</p>
          <button onClick={reset}
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-[12px]
                       tracking-widest py-3 rounded-sm transition-all duration-200">
            Play Again
          </button>
        </div>
      )}

      {/* Choices */}
      {!gameOver && (
        <div className="flex gap-4 flex-wrap justify-center">
          {CHOICES.map(c => (
            <button key={c} onClick={() => play(c)} disabled={animating}
              className={`flex flex-col items-center gap-2 w-24 py-4 rounded-2xl border
                          transition-all duration-150 active:scale-90 select-none
                          disabled:opacity-50 disabled:cursor-not-allowed
                          bg-[#141c26] border-cyan-500/15
                          hover:border-cyan-400 hover:bg-[#1a2535] hover:-translate-y-1
                          ${playerChoice === c ? "border-cyan-400 bg-[#1a2535]" : ""}`}>
              <span className="text-3xl">{EMOJI[c]}</span>
              <span className="font-mono text-[11px] text-slate-400 capitalize">{c}</span>
            </button>
          ))}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="w-full max-w-xs">
          <p className="font-mono text-[11px] text-slate-600 tracking-widest uppercase mb-2">History</p>
          <div className="flex flex-col gap-1">
            {history.map((h, i) => (
              <div key={i} className={`flex items-center justify-between bg-[#141c26]
                                       border border-cyan-500/8 rounded px-3 py-1.5
                                       ${i === 0 ? "opacity-100" : "opacity-50"}`}>
                <span className="text-lg">{EMOJI[h.player]}</span>
                <span className={`font-mono text-[10px] tracking-widest
                                  ${h.result === "win" ? "text-emerald-400" : h.result === "lose" ? "text-red-400" : "text-amber-400"}`}>
                  {h.result.toUpperCase()}
                </span>
                <span className="text-lg">{EMOJI[h.cpu]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
