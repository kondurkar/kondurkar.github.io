import { ME } from "../data/config";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 py-8 text-center font-mono text-[12px] text-slate-600 tracking-wide">
      © {year} {ME.name} — Designed & built by hand. Deployed on GitHub Pages.
    </footer>
  );
}
