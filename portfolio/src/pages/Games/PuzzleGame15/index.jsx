import { useEffect, useState } from "react";
import shuffleArray from "../../../utils/shuffleFunction";
import Puzzle from "./Puzzle";
import Timer from "./Timer";

export default function PuzzleGame15() {
  const [shuffledArray, setShuffledArray] = useState(shuffleArray());
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    if (moves === 1) setTimerActive(true);
    let won = true;
    for (let i = 0; i < shuffledArray.length - 1; i++) {
      const value = shuffledArray[i];
      if (i == value - 1) continue;
      else {
        won = false;
        break;
      }
    }
    if (won) {
      setWin(true);
      setTimerActive(false);
    }
    return;
  }, [moves]);

  const newGame = () => {
    setMoves(0);
    setTimerActive(false);
    setTime(0);
    setShuffledArray(shuffleArray());
    setWin(false);
  };

  const dragStart = (e) => e.dataTransfer.setData("tile", e.target.id);

  const dragOver = (e) => e.preventDefault();

  const dropped = (e) => {
    e.preventDefault();
    const tile = e.dataTransfer.getData("tile");
    const oldPlace =
      Number(document.getElementById(tile).parentElement.id.slice(6)) - 1;
    const newPlace = Number(e.target.id.slice(6)) - 1;

    if (
      !(
        Math.abs(oldPlace - newPlace) == 4 || Math.abs(oldPlace - newPlace) == 1
      )
    )
      return;

    const [i, j] = [Math.min(oldPlace, newPlace), Math.max(oldPlace, newPlace)];
    setShuffledArray([
      ...shuffledArray.slice(0, i),
      shuffledArray[j],
      ...shuffledArray.slice(i + 1, j),
      shuffledArray[i],
      ...shuffledArray.slice(j + 1),
    ]);
    setMoves(moves + 1);
  };

  return (
    <div className="h-screen flex text-gray-300 bg-gray-950">
      <div className="mx-auto mt-8 max-w-[464px]">
        {win && (
          <div className="rounded-md border-l-4 border-green-500 bg-green-100 p-2 mb-2">
            <div className="flex items-center justify-center space-x-4">
              <p className="font-medium text-green-600">
                HURRAY!! You have won the game
              </p>
            </div>
          </div>
        )}
        <h3
          className="text-xl font-bold 
        text-center bg-clip-text 
        text-transparent bg-gradient-to-r 
        from-indigo-500 from-10% via-sky-500 
        via-30% to-emerald-500 to-90% mb-2"
        >
          15 Puzzle Game
        </h3>
        <p className="font-mono text-[13px] text-slate-500 mb-12 text-center">
          The classic sliding tile puzzle — arrange 15 numbered tiles into order using the empty space.
        </p>
        <div className="flex justify-between px-6 mt-2">
          <p>Moves: {moves}</p>
          <Timer time={time} timerActive={timerActive} setTime={setTime} />
        </div>
        <Puzzle
          shuffledArray={shuffledArray}
          dragStart={dragStart}
          dragOver={dragOver}
          dropped={dropped}
        />
        <div className="px-6 mt-4">
          <button
            onClick={newGame}
            className="text-black font-bold block 
            bg-gray-900 p-2 rounded w-full 
            h-full bg-gradient-to-r from-indigo-500 
            from-10% via-sky-500 via-30% to-emerald-500 to-90%"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
