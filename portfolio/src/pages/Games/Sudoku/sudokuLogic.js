// Check if placing num at (row, col) is valid
function isValid(board, row, col, num) {
  // Row check
  if (board[row].includes(num)) return false;
  // Col check
  if (board.some(r => r[col] === num)) return false;
  // 3x3 box check
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++)
    for (let c = bc; c < bc + 3; c++)
      if (board[r][c] === num) return false;
  return true;
}

// Solve using backtracking
function solve(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== 0) continue;
      for (let num = 1; num <= 9; num++) {
        if (isValid(board, r, c, num)) {
          board[r][c] = num;
          if (solve(board)) return true;
          board[r][c] = 0;
        }
      }
      return false;
    }
  }
  return true;
}

// Generate a full valid board
function generateFull() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  const nums  = [1,2,3,4,5,6,7,8,9];

  function fill(r, c) {
    if (r === 9) return true;
    const nr = c === 8 ? r + 1 : r;
    const nc = c === 8 ? 0     : c + 1;
    const shuffled = [...nums].sort(() => Math.random() - 0.5);
    for (const n of shuffled) {
      if (isValid(board, r, c, n)) {
        board[r][c] = n;
        if (fill(nr, nc)) return true;
        board[r][c] = 0;
      }
    }
    return false;
  }

  fill(0, 0);
  return board;
}

const CLUES = { easy: 36, medium: 27, hard: 20 };

// Remove cells to create a puzzle
export function generatePuzzle(difficulty = "medium") {
  const full   = generateFull();
  const puzzle = full.map(r => [...r]);
  const clues  = CLUES[difficulty];
  let   removed = 0;
  const target  = 81 - clues;

  const cells = Array.from({ length: 81 }, (_, i) => i)
    .sort(() => Math.random() - 0.5);

  for (const idx of cells) {
    if (removed >= target) break;
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;
    removed++;
    // Simple check: don't validate unique solution for perf
    // (good enough for a portfolio game)
    _ = backup;
  }

  return { puzzle, solution: full };
}

export function getConflicts(board) {
  const conflicts = new Set();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (!val) continue;
      // Row
      for (let cc = 0; cc < 9; cc++) {
        if (cc !== c && board[r][cc] === val) {
          conflicts.add(`${r}-${c}`);
          conflicts.add(`${r}-${cc}`);
        }
      }
      // Col
      for (let rr = 0; rr < 9; rr++) {
        if (rr !== r && board[rr][c] === val) {
          conflicts.add(`${r}-${c}`);
          conflicts.add(`${rr}-${c}`);
        }
      }
      // Box
      const br = Math.floor(r / 3) * 3;
      const bc = Math.floor(c / 3) * 3;
      for (let rr = br; rr < br + 3; rr++) {
        for (let cc = bc; cc < bc + 3; cc++) {
          if ((rr !== r || cc !== c) && board[rr][cc] === val) {
            conflicts.add(`${r}-${c}`);
            conflicts.add(`${rr}-${cc}`);
          }
        }
      }
    }
  }
  return conflicts;
}
