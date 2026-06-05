// src/utils/shuffleFunction.js
// ─────────────────────────────────────────────────────────────
// A random shuffle of the 15-puzzle produces an unsolvable
// configuration ~50% of the time. This function guarantees
// a solvable puzzle every time using inversion count math.
// ─────────────────────────────────────────────────────────────

/**
 * Count inversions in the flat array (ignoring the empty tile "").
 * An inversion is any pair (i, j) where i < j but arr[i] > arr[j].
 */
function countInversions(array) {
  const nums = array.filter(v => v !== "");
  let inversions = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) inversions++;
    }
  }
  return inversions;
}

/**
 * For a 4×4 grid, a puzzle is solvable if:
 *
 * - Empty tile on an ODD row from bottom (1, 3)  → inversions must be EVEN
 * - Empty tile on an EVEN row from bottom (2, 4) → inversions must be ODD
 *
 * Row from bottom = 4 - Math.floor(emptyIndex / 4)
 */
function isSolvable(array) {
  const emptyIndex   = array.indexOf("");
  const emptyRowFromBottom = 4 - Math.floor(emptyIndex / 4); // 1-based from bottom
  const inversions   = countInversions(array);

  if (emptyRowFromBottom % 2 === 1) {
    return inversions % 2 === 0; // odd row from bottom → even inversions
  } else {
    return inversions % 2 === 1; // even row from bottom → odd inversions
  }
}

/**
 * Fisher-Yates shuffle
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Returns a guaranteed solvable shuffle.
 * Worst case: 2 attempts on average (50% chance each time).
 * In practice resolves in 1–3 shuffles.
 */
export default function shuffleArray() {
  const base = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ""];
  let result;
  do {
    result = shuffle(base);
  } while (!isSolvable(result));
  return result;
}