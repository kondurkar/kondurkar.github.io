import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ME } from "../data/config";
import { useScrollSpy } from "../hooks/useScrollSpy";

const SECTION_IDS = ["about", "skills", "experience", "projects", "games", "blog", "contact"];

function NavLink({ id, active, isHome, location, onClick }) {
  const isPage     = ["blog", "projects", "games"].includes(id);
  const pathMap    = { blog: "/blog", projects: "/projects", games: "/games" };
  const isActive   = isPage
    ? location.pathname.startsWith(pathMap[id])
    : isHome && active === id;
  const label      = id === "experience" ? "exp" : id;

  const cls = `font-mono text-[13px] tracking-widest no-underline transition-colors duration-200
               group flex items-center
               ${isActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"}`;

  const accent = (
    <span className={`text-cyan-400 mr-0.5 transition-opacity duration-200
                      ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
      _
    </span>
  );

  if (isPage) return <Link to={pathMap[id]} className={cls} onClick={onClick}>{accent}{label}</Link>;
  return (
    <a href={isHome ? `#${id}` : `/#${id}`} className={cls} onClick={onClick}>
      {accent}{label}
    </a>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active   = useScrollSpy(["hero", ...SECTION_IDS]);
  const location = useLocation();
  const isHome   = location.pathname === "/";
  const [firstName, lastName] = ME.name.split(" ");

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Shadow on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 h-16 flex items-center justify-between px-6 md:px-8
                       bg-[#080c10]/90 backdrop-blur-xl border-b border-cyan-500/10
                       transition-shadow duration-300
                       ${scrolled ? "shadow-[0_4px_32px_rgba(0,0,0,0.4)]" : ""}`}>

        {/* Logo */}
        <Link to="/" className="font-mono text-[15px] text-cyan-400 tracking-wide no-underline z-10">
          {firstName?.toLowerCase() || "your"}
          <span className="text-slate-400">.{lastName?.toLowerCase() || "name"}</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-6 list-none m-0 p-0">
          {SECTION_IDS.map(id => (
            <li key={id}>
              <NavLink id={id} active={active} isHome={isHome} location={location} />
            </li>
          ))}
        </ul>

        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          className="md:hidden relative z-10 w-8 h-8 flex flex-col justify-center items-center gap-1.5
                     focus:outline-none"
        >
          <span className={`block h-px w-6 bg-cyan-400 transition-all duration-300 origin-center
                            ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-px bg-cyan-400 transition-all duration-300
                            ${menuOpen ? "w-0 opacity-0" : "w-6 opacity-100"}`} />
          <span className={`block h-px w-6 bg-cyan-400 transition-all duration-300 origin-center
                            ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300
                       ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>

        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#080c10]/80 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Slide-in panel */}
        <div className={`absolute top-16 left-0 right-0 bg-[#0d1117] border-b border-cyan-500/15
                         transition-transform duration-300 ease-out
                         ${menuOpen ? "translate-y-0" : "-translate-y-4"}`}>

          {/* Grid bg inside drawer */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          <ul className="relative list-none m-0 p-0 flex flex-col divide-y divide-cyan-500/8">
            {SECTION_IDS.map((id, i) => (
              <li key={id}
                className="transition-all duration-200"
                style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
              >
                <div className={`px-8 py-4 transition-all duration-300
                                 ${menuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                  style={{ transitionDelay: menuOpen ? `${i * 40 + 60}ms` : "0ms" }}>
                  <NavLink
                    id={id}
                    active={active}
                    isHome={isHome}
                    location={location}
                    onClick={() => setMenuOpen(false)}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* Contact CTA inside drawer */}
          <div className="px-8 py-5 border-t border-cyan-500/10">
            <a
              href={`mailto:${ME.email}`}
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black
                         font-mono text-[12px] tracking-widest px-5 py-2.5 rounded-sm
                         transition-all duration-200 no-underline w-full justify-center"
            >
              ✉ {ME.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
