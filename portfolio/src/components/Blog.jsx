import { Link } from "react-router-dom";
import { BLOGS } from "../data/blogs";
import { useFadeUp } from "../hooks/useFadeUp";
import SectionLabel from "./SectionLabel";

function BlogCard({ slug, date, readTime, title, excerpt, tags }) {
  const ref = useFadeUp();
  return (
    <Link
      ref={ref}
      to={`/blog/${slug}`}
      className="fade-up block bg-[#141c26] border border-cyan-500/10 rounded p-7 no-underline
                 transition-all duration-200 hover:border-cyan-500/25 hover:-translate-y-0.5"
    >
      <div className="font-mono text-[11px] text-cyan-400 tracking-[0.1em] mb-3">
        {date} · {readTime}
      </div>
      <div className="font-display font-semibold text-[1.05rem] text-slate-100 leading-[1.4] mb-2
                      group-hover:text-cyan-400 transition-colors duration-200">
        {title}
      </div>
      <p className="text-[14px] text-slate-500 leading-[1.7]">{excerpt}</p>
      <div className="flex flex-wrap gap-1.5 mt-4">
        {tags.map(tag => (
          <span key={tag} className="font-mono text-[11px] text-cyan-400 bg-cyan-400/8 border border-cyan-400/15 px-2.5 py-0.5 rounded-sm tracking-wide">
            {tag}
          </span>
        ))}
      </div>
      <div className="font-mono text-[12px] text-cyan-400 mt-4 group-hover:translate-x-1 transition-transform duration-200">
        Read more →
      </div>
    </Link>
  );
}

export default function Blog() {
  const titleRef = useFadeUp();
  const btnRef   = useFadeUp();
  const featured = BLOGS.slice(0, 3);

  return (
    <section id="blog" className="relative z-10 max-w-[1100px] mx-auto px-8 py-24">
      <SectionLabel index="06" label="writing" />
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <h2 ref={titleRef} className="fade-up font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-slate-100 mb-0">
        From the Blog
      </h2>
        <Link
          ref={btnRef}
          to="/blog"
          className="fade-up font-mono text-[13px] text-cyan-400 no-underline border border-cyan-500/25
                     px-5 py-2.5 rounded-sm hover:bg-cyan-500/6 hover:border-cyan-400 transition-all duration-200"
        >
          View all {BLOGS.length} posts →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.map(post => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </section>
  );
}
