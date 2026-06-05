// src/pages/Games/PuzzleGame15/Puzzle.jsx
import { FilledTile, EmptyTile } from "./Tile";

export default function Puzzle({ shuffledArray, selectedIndex, onTileClick, onEmptyClick, isSolved }) {
  const emptyIndex = shuffledArray.indexOf("");

  // A filled tile is adjacent to empty if it can legally move
  const isAdjacent = (idx) => {
    const diff = Math.abs(idx - emptyIndex);
    if (diff === 1) {
      // Same row check — prevent wrapping across rows
      return Math.floor(idx / 4) === Math.floor(emptyIndex / 4);
    }
    return diff === 4;
  };

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-sm mx-auto">
      {shuffledArray.map((value, index) => {
        if (value === "") {
          return (
            <EmptyTile
              key={index}
              index={index}
              isTarget={selectedIndex !== null && isAdjacent(selectedIndex)}
              onClick={() => onEmptyClick(index)}
            />
          );
        }
        return (
          <FilledTile
            key={index}
            index={index}
            value={value}
            isSolved={isSolved}
            isSelected={selectedIndex === index}
            onClick={() => onTileClick(index)}
          />
        );
      })}
    </div>
  );
}
