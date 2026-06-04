// src/pages/Games/Game2048/Grid.jsx
import Tile from "./Tile";

export default function Grid({ grid }) {
  return (
    <div className="relative bg-[#0d1117] border border-cyan-500/15 rounded-xl p-3
                    shadow-[0_0_40px_rgba(0,200,255,0.05)]">
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {grid.map((row, r) =>
          row.map((val, c) => (
            <Tile key={`${r}-${c}`} value={val} />
          ))
        )}
      </div>
    </div>
  );
}
