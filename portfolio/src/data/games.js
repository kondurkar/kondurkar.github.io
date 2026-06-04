// To add a new game:
//   1. Create src/pages/Games/YourGame/index.jsx
//   2. Add ONE object below — routes, tiles, everything updates
import { lazy } from "react";

export const GAMES = [
  {
    slug:      "15-puzzle",
    name:      "15 Puzzle",
    desc:      "The classic sliding tile puzzle — arrange 15 numbered tiles into order using the empty space. Built with React hooks, a move counter, and a live timer.",
    tags:      ["React", "Hooks", "Game Logic", "CSS Grid"],
    emoji:     "🧩",
    status:    "live",
    highlight: "#00c8ff",
    component: lazy(() => import("../pages/Games/PuzzleGame15/index.jsx")),
  },
  {
    slug:      "memory-game",
    name:      "Memory Card Game",
    desc:      "Flip cards to find matching pairs before time runs out. 3 difficulty levels — Easy (12 cards), Medium (20 cards), Hard (24 cards). Built with React hooks and CSS 3D flip animations.",
    tags:      ["React", "useState", "CSS 3D", "Game Logic"],
    emoji:     "🃏",
    status:    "live",
    highlight: "#00ff9d",
    component: lazy(() => import("../pages/Games/MemoryGame/index.jsx")),
  },

  // Add new game → copy paste block below, uncomment, fill in:
  // {
  //   slug:      "snake",
  //   name:      "Snake Game",
  //   desc:      "Classic snake — eat food, grow longer, don't hit the walls.",
  //   tags:      ["React", "useReducer", "Canvas"],
  //   emoji:     "🐍",
  //   status:    "coming-soon",
  //   highlight: "#7b5ea7",
  //   component: lazy(() => import("../pages/Games/Snake/index.jsx")),
  // },
];
