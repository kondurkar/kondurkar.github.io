// src/pages/Games/TicTacToe/minimax.js

export function getBestMove(board, isMaximizing = true) {
  const result = checkWinner(board);
  if (result === "O") return { score: 10 };
  if (result === "X") return { score: -10 };
  if (board.every(Boolean)) return { score: 0 };

  const moves = [];
  board.forEach((cell, i) => {
    if (cell) return;
    const next = [...board];
    next[i] = isMaximizing ? "O" : "X";
    const { score } = getBestMove(next, !isMaximizing);
    moves.push({ index: i, score });
  });

  return moves.reduce((best, m) =>
    isMaximizing ? (m.score > best.score ? m : best)
                 : (m.score < best.score ? m : best)
  );
}

export function checkWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
  }
  return null;
}

export function getWinningLine(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const line of lines) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return line;
  }
  return null;
}
