import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      el.style.left = e.clientX + "px";
      el.style.top  = e.clientY + "px";
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2
                 w-[400px] h-[400px] rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(0,200,255,0.04) 0%, transparent 70%)",
        transition: "left 0.08s, top 0.08s",
      }}
    />
  );
}
