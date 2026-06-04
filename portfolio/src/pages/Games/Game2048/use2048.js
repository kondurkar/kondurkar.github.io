// src/pages/Games/Game2048/use2048.js
// All game logic isolated in a custom hook
import { useState, useCallback, useEffect } from "react";

const SIZE = 4;

// ── Pure helpers ────────────────────────────────────────────

function emptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function randomEmptyCell(grid) {
  const empty = [];
  grid.forEach((row, r) =>
    row.forEach((val, c) => { if (!val) empty.push([r, c]); })
  );
  if (!empty.length) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

function addRandomTile(grid) {
  const cell = randomEmptyCell(grid);
  if (!cell) return grid;
  const next = grid.map(r => [...r]);
  next[cell[0]][cell[1]] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slideRow(row) {
  // Remove zeros
  const nums = row.filter(Boolean);
  let score  = 0;
  // Merge adjacent equal tiles
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) {
      nums[i]    *= 2;
      score      += nums[i];
      nums[i + 1] = 0;
    }
  }
  const merged = nums.filter(Boolean);
  // Pad with zeros
  while (merged.length < SIZE) merged.push(0);
  return { row: merged, score };
}

function moveLeft(grid) {
  let score = 0;
  let moved = false;
  const next = grid.map(row => {
    const { row: newRow, score: s } = slideRow(row);
    score += s;
    if (newRow.join() !== row.join()) moved = true;
    return newRow;
  });
  return { grid: next, score, moved };
}

function rotateRight(grid) {
  return grid[0].map((_, c) => grid.map(row => row[c]).reverse());
}
function rotateLeft(grid) {
  return grid[0].map((_, c) => grid.map(row => row[row.length - 1 - c]));
}

function move(grid, direction) {
  let rotated = grid;
  // Normalise: always slide left after rotation
  if (direction === "right") rotated = rotateRight(rotateRight(grid));
  if (direction === "up")    rotated = rotateLeft(grid);
  if (direction === "down")  rotated = rotateRight(grid);

  const { grid: slid, score, moved } = moveLeft(rotated);

  let result = slid;
  if (direction === "right") result = rotateRight(rotateRight(slid));
  if (direction === "up")    result = rotateRight(slid);
  if (direction === "down")  result = rotateLeft(slid);

  return { grid: result, score, moved };
}

function hasWon(grid) {
  return grid.some(row => row.some(v => v >= 2048));
}

function canMove(grid) {
  // Any empty cell?
  if (randomEmptyCell(grid)) return true;
  // Any adjacent equal tiles?
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

function initGrid() {
  let g = emptyGrid();
  g = addRandomTile(g);
  g = addRandomTile(g);
  return g;
}

// ── Hook ─────────────────────────────────────────────────────
export function use2048() {
  const [grid,      setGrid]      = useState(() => initGrid());
  const [score,     setScore]     = useState(0);
  const [best,      setBest]      = useState(() => Number(localStorage.getItem("2048-best") || 0));
  const [status,    setStatus]    = useState("playing"); // "playing" | "won" | "over"
  const [keepGoing, setKeepGoing] = useState(false);

  const handleMove = useCallback((direction) => {
    if (status === "over") return;
    if (status === "won" && !keepGoing) return;

    setGrid(prev => {
      const { grid: next, score: gained, moved } = move(prev, direction);
      if (!moved) return prev;

      const withTile = addRandomTile(next);

      setScore(s => {
        const newScore = s + gained;
        setBest(b => {
          const newBest = Math.max(b, newScore);
          localStorage.setItem("2048-best", newBest);
          return newBest;
        });
        return newScore;
      });

      if (!keepGoing && hasWon(withTile)) setStatus("won");
      else if (!canMove(withTile))        setStatus("over");

      return withTile;
    });
  }, [status, keepGoing]);

  const restart = useCallback(() => {
    setGrid(initGrid());
    setScore(0);
    setStatus("playing");
    setKeepGoing(false);
  }, []);

  const continueGame = useCallback(() => {
    setKeepGoing(true);
    setStatus("playing");
  }, []);

  // Keyboard
  useEffect(() => {
    const MAP = {
      ArrowLeft:  "left",
      ArrowRight: "right",
      ArrowUp:    "up",
      ArrowDown:  "down",
    };
    const onKey = (e) => {
      if (MAP[e.key]) {
        e.preventDefault();
        handleMove(MAP[e.key]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleMove]);

  return { grid, score, best, status, handleMove, restart, continueGame };
}
