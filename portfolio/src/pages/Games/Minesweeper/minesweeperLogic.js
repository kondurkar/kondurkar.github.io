// src/pages/Games/Minesweeper/minesweeperLogic.js

export const CONFIGS = {
  easy:   { rows: 9,  cols: 9,  mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard:   { rows: 16, cols: 30, mines: 99 },
};

export function createBoard({ rows, cols, mines }, firstClick = null) {
  // Place mines (avoid firstClick and its neighbors)
  const safe = new Set();
  if (firstClick !== null) {
    const [fr, fc] = firstClick;
    for (let r = fr - 1; r <= fr + 1; r++)
      for (let c = fc - 1; c <= fc + 1; c++)
        if (r >= 0 && r < rows && c >= 0 && c < cols)
          safe.add(r * cols + c);
  }

  const positions = Array.from({ length: rows * cols }, (_, i) => i)
    .filter(i => !safe.has(i))
    .sort(() => Math.random() - 0.5)
    .slice(0, mines);

  const mineSet = new Set(positions);

  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const idx = r * cols + c;
      return {
        r, c,
        mine:      mineSet.has(idx),
        revealed:  false,
        flagged:   false,
        adjacent:  0,
      };
    })
  ).map((row, r, grid) =>
    row.map((cell, c) => {
      if (cell.mine) return cell;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].mine)
            count++;
        }
      return { ...cell, adjacent: count };
    })
  );
}

// Flood-fill reveal for empty cells
export function floodReveal(board, r, c, rows, cols) {
  const next = board.map(row => row.map(cell => ({ ...cell })));
  const queue = [[r, c]];
  const visited = new Set();

  while (queue.length) {
    const [cr, cc] = queue.shift();
    const key = cr * cols + cc;
    if (visited.has(key)) continue;
    visited.add(key);

    const cell = next[cr][cc];
    if (cell.flagged || cell.revealed) continue;
    cell.revealed = true;

    if (cell.adjacent === 0 && !cell.mine) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = cr + dr, nc = cc + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(nr * cols + nc))
            queue.push([nr, nc]);
        }
    }
  }
  return next;
}

export function checkWin(board) {
  return board.every(row =>
    row.every(cell => cell.mine ? !cell.revealed : cell.revealed)
  );
}
