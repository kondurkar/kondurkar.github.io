import { lazy } from "react";
import GridOnIcon from "@mui/icons-material/GridOn";
import ExtensionIcon from "@mui/icons-material/Extension";
import StyleIcon from "@mui/icons-material/Style";
import AppsIcon from "@mui/icons-material/Apps";
import CloseIcon from "@mui/icons-material/Close";
import PestControlRodentIcon from "@mui/icons-material/PestControlRodent";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import CasinoIcon from "@mui/icons-material/Casino";
import FrontHandIcon from "@mui/icons-material/FrontHand";
import TimerIcon from "@mui/icons-material/Timer";
import AbcIcon from "@mui/icons-material/Abc";
import FlagIcon from "@mui/icons-material/Flag";

export const GAMES = [
  {
    slug:      "sudoku",
    name:      "Sudoku",
    desc:      "Generated 9×9 puzzle with 3 difficulty levels, notes mode, conflict highlighting, hints, and a live timer.",
    tags:      ["React", "Backtracking", "Algorithm", "Puzzle"],
    icon:     GridOnIcon,
    status:    "live",
    highlight: "#7b5ea7",
    component: lazy(() => import("../pages/Games/Sudoku/index.jsx")),
  },
  {
    slug:      "15-puzzle",
    name:      "15 Puzzle",
    desc:      "Arrange 15 numbered tiles into order using the empty space. Tap, swipe, or use arrow keys. Built with React hooks.",
    tags:      ["React", "Hooks", "Touch Events", "CSS Grid"],
    icon:     ExtensionIcon,
    status:    "live",
    highlight: "#00c8ff",
    component: lazy(() => import("../pages/Games/PuzzleGame15/index.jsx")),
  },
  {
    slug:      "memory-game",
    name:      "Memory Card Game",
    desc:      "Flip cards to find matching pairs before time runs out. 3 difficulty levels — Easy (12 cards), Medium (20 cards), Hard (24 cards). Built with React hooks and CSS 3D flip animations.",
    tags:      ["React", "useState", "CSS 3D", "Game Logic"],
    icon:     StyleIcon,
    status:    "live",
    highlight: "#00ff9d",
    component: lazy(() => import("../pages/Games/MemoryGame/index.jsx")),
  },
  {
    slug:      "2048",
    name:      "2048",
    desc:      "Slide tiles to merge numbers and reach 2048. Keyboard arrows on desktop, swipe gestures on mobile. Tracks your best score in localStorage.",
    tags:      ["React", "useReducer", "Custom Hook", "Touch Events"],
    icon:     AppsIcon,
    status:    "live",
    highlight: "#7b5ea7",
    component: lazy(() => import("../pages/Games/Game2048/index.jsx")),
  },
  {
    slug:      "tic-tac-toe",
    name:      "Tic Tac Toe",
    desc:      "Play against an unbeatable AI powered by the minimax algorithm, or challenge a friend in 2-player mode.",
    tags:      ["React", "Minimax", "AI", "Game Logic"],
    icon:     CloseIcon,
    status:    "live",
    highlight: "#00c8ff",
    component: lazy(() => import("../pages/Games/TicTacToe/index.jsx")),
  },
  {
    slug:      "whack-a-mole",
    name:      "Whack-a-Mole",
    desc:      "Whack the moles, dodge the bombs. 3 difficulty levels with increasing speed. 30 seconds on the clock.",
    tags:      ["React", "useRef", "Timers", "Animation"],
    icon:     PestControlRodentIcon,
    status:    "live",
    highlight: "#00ff9d",
    component: lazy(() => import("../pages/Games/WhackAMole/index.jsx")),
  },
  {
    slug:      "wordle",
    name:      "Wordle Clone",
    desc:      "Guess the 5-letter word in 6 tries. Colour-coded feedback, on-screen keyboard, and physical keyboard support.",
    tags:      ["React", "useCallback", "Keyboard Events", "Game Logic"],
    icon:     SpellcheckIcon,
    status:    "live",
    highlight: "#00ff9d",
    component: lazy(() => import("../pages/Games/Wordle/index.jsx")),
  },
  {
    slug: "dice-roller", 
    name: "Dice Roller",
    desc: "Roll up to 5 dice with custom sides (d4–d20). Presets, animated rolls, and history.",
    tags: ["React", "useState", "Animation"], 
    icon:     CasinoIcon,
    status: "live", 
    highlight: "#f59e0b",
    component: lazy(() => import("../pages/Games/DiceRoller/index.jsx")),
  },
  {
    slug: "rock-paper-scissors", 
    name: "Rock Paper Scissors",
    desc: "Best-of-3/5/7 series against the CPU. Animated reveal with win/draw/loss tracking.",
    tags: ["React", "Game Logic", "Animation"], 
    icon:     FrontHandIcon,
    status: "live", 
    highlight: "#00c8ff",
    component: lazy(() => import("../pages/Games/RockPaperScissors/index.jsx")),
  },
  {
    slug: "reaction-time", 
    name: "Reaction Time Test",
    desc: "Click when the screen turns green. Tracks your best and average across 10 attempts.",
    tags: ["React", "useRef", "performance.now()"], 
    icon:     TimerIcon,
    status: "live", 
    highlight: "#00ff9d",
    component: lazy(() => import("../pages/Games/ReactionTime/index.jsx")),
  },
  {
    slug: "hangman", 
    name: "Hangman",
    desc: "Guess frontend or general tech words letter by letter. SVG gallows, hints, and categories.",
    tags: ["React", "SVG", "Keyboard Events"], 
    icon:     AbcIcon,
    status: "live", 
    highlight: "#7b5ea7",
    component: lazy(() => import("../pages/Games/Hangman/index.jsx")),
  },
  {
    slug: "minesweeper", 
    name: "Minesweeper",
    desc: "Classic mine-sweeping with flood-fill reveal, flag mode, and 3 difficulty levels. First click is always safe.",
    tags: ["React", "Flood Fill", "Recursion", "Algorithm"], 
    icon:     FlagIcon,
    status: "live", 
    highlight: "#f43f5e",
    component: lazy(() => import("../pages/Games/Minesweeper/index.jsx")),
  },
  {
    slug: "28",
    name: "28",
    desc: "The classic 28 card game — bid, pick trump, declare pairs, and outscore your opponents across rounds. Play 2, 3, or 4 player modes against AI bots, with full scoring rules including doubling, full house, and pair adjustments.",
    tags: ["React", "Custom Hooks", "Reducer Pattern", "Card Game", "Strategy", "Multiplayer", "Bidding"],
    icon:     StyleIcon,
    status: "live",
    highlight: "#3ff466",
    component: lazy(() => import("../pages/Games/Card28/index.jsx")),
  },
];
