import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar     from "./components/Navbar";
import Hero       from "./components/Hero";
import About      from "./components/About";
import Skills     from "./components/Skills";
import Experience from "./components/Experience";
import Projects   from "./components/Projects";
import Blog       from "./components/Blog";
import Contact    from "./components/Contact";
import Footer     from "./components/Footer";
import CursorGlow from "./components/CursorGlow";
import BlogList   from "./pages/BlogList";
import BlogPost   from "./pages/BlogPost";

function Home() {
  return (
    <div className="relative bg-[#080c10] text-slate-100 overflow-x-hidden min-h-screen">
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-60"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />
      <CursorGlow />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/blog"        element={<BlogList />} />
        <Route path="/blog/:slug"  element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  );
}
