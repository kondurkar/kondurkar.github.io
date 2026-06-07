// src/pages/Games/Hangman/HangmanFigure.jsx

const PARTS = [
  // 1 - head
  <circle key="head" cx="140" cy="60" r="22" stroke="#00c8ff" strokeWidth="3" fill="none" />,
  // 2 - body
  <line key="body" x1="140" y1="82" x2="140" y2="150" stroke="#00c8ff" strokeWidth="3" strokeLinecap="round" />,
  // 3 - left arm
  <line key="larm" x1="140" y1="100" x2="105" y2="130" stroke="#00c8ff" strokeWidth="3" strokeLinecap="round" />,
  // 4 - right arm
  <line key="rarm" x1="140" y1="100" x2="175" y2="130" stroke="#00c8ff" strokeWidth="3" strokeLinecap="round" />,
  // 5 - left leg
  <line key="lleg" x1="140" y1="150" x2="105" y2="185" stroke="#00c8ff" strokeWidth="3" strokeLinecap="round" />,
  // 6 - right leg
  <line key="rleg" x1="140" y1="150" x2="175" y2="185" stroke="#00c8ff" strokeWidth="3" strokeLinecap="round" />,
];

export default function HangmanFigure({ wrongCount }) {
  return (
    <svg viewBox="0 0 220 220" className="w-44 h-44 mx-auto">
      {/* Gallows */}
      <line x1="20"  y1="210" x2="200" y2="210" stroke="#1a2535" strokeWidth="4" strokeLinecap="round" />
      <line x1="60"  y1="210" x2="60"  y2="10"  stroke="#1a2535" strokeWidth="4" strokeLinecap="round" />
      <line x1="60"  y1="10"  x2="140" y2="10"  stroke="#1a2535" strokeWidth="4" strokeLinecap="round" />
      <line x1="140" y1="10"  x2="140" y2="38"  stroke="#1a2535" strokeWidth="4" strokeLinecap="round" />

      {/* Body parts — revealed progressively */}
      {PARTS.slice(0, wrongCount)}
    </svg>
  );
}
