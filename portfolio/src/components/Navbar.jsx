import { ME } from "../data/config";
import { useScrollSpy } from "../hooks/useScrollSpy";

const NAV_ITEMS = ["about", "skills", "experience", "projects", "contact"];

export default function Navbar() {
  const active = useScrollSpy(["hero", ...NAV_ITEMS]);
  const [firstName, lastName] = ME.name.split(" ");

  return (
    <nav className="fixed top-0 w-full z-50 h-16 flex items-center justify-between px-8
                    bg-[#080c10]/85 backdrop-blur-xl border-b border-cyan-500/10">
      <a
        href="#hero"
        className="font-mono text-[15px] text-cyan-400 tracking-wide no-underline"
      >
        {firstName?.toLowerCase() || "your"}
        <span className="text-slate-500">
          .{lastName?.toLowerCase() || "name"}
        </span>
      </a>

      <ul className="flex gap-8 list-none m-0 p-0">
        {NAV_ITEMS.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`font-mono text-[13px] tracking-widest no-underline transition-colors duration-200
                          relative group
                          ${active === id ? "text-cyan-400" : "text-slate-500 hover:text-slate-200"}`}
            >
              <span className={`text-cyan-400 mr-0.5 transition-opacity duration-200
                                ${active === id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                _
              </span>
              {id === "experience" ? "exp" : id}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
