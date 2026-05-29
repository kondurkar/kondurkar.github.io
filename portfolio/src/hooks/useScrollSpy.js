import { useState, useEffect } from "react";

export function useScrollSpy(ids, offset = 100) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const handler = () => {
      let current = "";
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - offset) current = id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [ids, offset]);

  return active;
}
