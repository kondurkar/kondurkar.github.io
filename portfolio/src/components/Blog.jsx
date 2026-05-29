import { BLOG_POSTS } from "../data/config";
import { useFadeUp } from "../hooks/useFadeUp";
import SectionLabel from "./SectionLabel";

function BlogCard({ date, title, excerpt, href }) {
  const ref = useFadeUp();
  return (
    <a
      ref={ref}
      href={href}
      className="fade-up block bg-[#141c26] border border-cyan-500/10 rounded p-7 no-underline
                 transition-all duration-200 hover:border-cyan-500/25 hover:-translate-y-0.5"
    >
      <div className="font-mono text-[11px] text-cyan-400 tracking-[0.1em] mb-3">{date}</div>
      <div className="font-display font-semibold text-[1.05rem] text-slate-100 leading-[1.4] mb-2">
        {title}
      </div>
      <p className="text-[14px] text-slate-500 leading-[1.7]">{excerpt}</p>
      <div className="font-mono text-[12px] text-cyan-400 mt-4">Read more →</div>
    </a>
  );
}

export default function Blog() {
  const titleRef = useFadeUp();

  return (
    <section id="blog" className="relative z-10 max-w-[1100px] mx-auto px-8 py-24">
      <SectionLabel index="05" label="writing" />
      <h2 ref={titleRef} className="fade-up font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-slate-100 mb-10">
        From the Blog
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {BLOG_POSTS.map((post, i) => (
          <BlogCard key={i} {...post} />
        ))}
      </div>
    </section>
  );
}
