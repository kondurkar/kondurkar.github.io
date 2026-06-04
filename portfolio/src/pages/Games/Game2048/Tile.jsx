// src/pages/Games/Game2048/Tile.jsx

const TILE_STYLES = {
  0:    { bg: "bg-[#1a2535]",    text: "text-transparent",  size: "text-2xl" },
  2:    { bg: "bg-[#eee4da]",    text: "text-[#776e65]",    size: "text-2xl" },
  4:    { bg: "bg-[#ede0c8]",    text: "text-[#776e65]",    size: "text-2xl" },
  8:    { bg: "bg-[#f2b179]",    text: "text-white",         size: "text-2xl" },
  16:   { bg: "bg-[#f59563]",    text: "text-white",         size: "text-2xl" },
  32:   { bg: "bg-[#f67c5f]",    text: "text-white",         size: "text-2xl" },
  64:   { bg: "bg-[#f65e3b]",    text: "text-white",         size: "text-2xl" },
  128:  { bg: "bg-[#edcf72]",    text: "text-white",         size: "text-xl"  },
  256:  { bg: "bg-[#edcc61]",    text: "text-white",         size: "text-xl"  },
  512:  { bg: "bg-[#edc850]",    text: "text-white",         size: "text-xl"  },
  1024: { bg: "bg-[#00c8ff]",    text: "text-[#080c10]",     size: "text-lg"  },
  2048: { bg: "bg-[#00ff9d]",    text: "text-[#080c10]",     size: "text-lg"  },
};

function getStyle(value) {
  return TILE_STYLES[value] ?? {
    bg: "bg-[#00ff9d]", text: "text-[#080c10]", size: "text-base",
  };
}

export default function Tile({ value }) {
  const style   = getStyle(value);
  const isEmpty = value === 0;

  return (
    <div className={`flex items-center justify-center rounded-md font-display font-extrabold
                     aspect-square w-full transition-all duration-100
                     ${style.bg} ${style.text} ${style.size}
                     ${!isEmpty ? "shadow-lg scale-100" : ""}
                     ${value === 2048 ? "shadow-[0_0_20px_rgba(0,255,157,0.5)]" : ""}
                     ${value === 1024 ? "shadow-[0_0_16px_rgba(0,200,255,0.4)]" : ""}
                   `}>
      {isEmpty ? "" : value}
    </div>
  );
}
