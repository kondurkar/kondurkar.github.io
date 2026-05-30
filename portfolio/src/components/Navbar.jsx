import { Link, useLocation } from "react-router-dom";
import { ME } from "../data/config";
import { useScrollSpy } from "../hooks/useScrollSpy";

const SECTION_IDS = ["about", "skills", "experience", "projects", "blog", "contact"];

export default function Navbar() {
  const active   = useScrollSpy(["hero", ...SECTION_IDS]);
  const location = useLocation();
  const isHome   = location.pathname === "/";
  const [firstName, lastName] = ME.name.split(" ");

  return (
    <nav className="fixed top-0 w-full z-50 h-16 flex items-center justify-between px-8
                    bg-[#080c10]/85 backdrop-blur-xl border-b border-cyan-500/10">
      <Link
        to="/"
        className="font-mono text-[15px] text-cyan-400 tracking-wide no-underline"
      >
        {firstName?.toLowerCase() || "your"}
        <span className="text-slate-500">.{lastName?.toLowerCase() || "name"}</span>
      </Link>

      <ul className="flex gap-8 list-none m-0 p-0">
        {SECTION_IDS.map((id) => {
          // Blog links to /blog page
          if (id === "blog") {
            const isActive = location.pathname.startsWith("/blog");
            return (
              <li key={id}>
                <Link
                  to="/blog"
                  className={`font-mono text-[13px] tracking-widest no-underline transition-colors duration-200 group
                              ${isActive ? "text-cyan-400" : "text-slate-500 hover:text-slate-200"}`}
                >
                  <span className={`text-cyan-400 mr-0.5 transition-opacity duration-200
                                    ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    _
                  </span>
                  blog
                </Link>
              </li>
            );
          }

          // Projects → /projects page
          if (id === "projects") {
            const isActive = location.pathname === "/projects";
            return (
              <li key={id}>
                <Link to="/projects"
                  className={`font-mono text-[13px] tracking-widest no-underline transition-colors duration-200 group
                    ${isActive ? "text-cyan-400" : "text-slate-500 hover:text-slate-200"}`}>
                  <span className={`text-cyan-400 mr-0.5 transition-opacity duration-200
                    ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>_</span>
                  projects
                </Link>
              </li>
            );
          }

          // All other → anchor links
          return (
          <li key={id}>
            <a
                href={isHome ? `#${id}` : `/#${id}`}
              className={`font-mono text-[13px] tracking-widest no-underline transition-colors duration-200 group
                            ${isHome && active === id ? "text-cyan-400" : "text-slate-500 hover:text-slate-200"}`}
            >
              <span className={`text-cyan-400 mr-0.5 transition-opacity duration-200
                                  ${isHome && active === id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                _
              </span>
              {id === "experience" ? "exp" : id}
            </a>
          </li>
          );
        })}
      </ul>
    </nav>
  );
}
