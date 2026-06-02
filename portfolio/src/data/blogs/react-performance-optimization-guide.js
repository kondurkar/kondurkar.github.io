export default {
  slug: "react-performance-optimization-guide",
  title: "React Performance Optimization: The Complete Practical Guide",
  date: "Mar 2025",
  readTime: "10 min read",
  tags: ["React", "Performance", "Optimization"],
  excerpt:
    "Slow React apps are almost never React's fault — they're a result of re-renders we didn't think about, expensive computations run on every keystroke, and components doing too much. Here's how to diagnose and fix them.",
  content: `
## Why React Re-renders

React re-renders a component when:
1. Its **state** changes
2. Its **props** change
3. Its **parent** re-renders (even if props didn't change)
4. A **context** it consumes changes

Most performance issues stem from unnecessary re-renders caused by rule #3. Understanding this is 80% of React performance work.

## Step 1: Measure First, Optimize Second

Never guess. Use the React DevTools Profiler:

1. Open DevTools → Profiler tab
2. Click Record
3. Interact with your app
4. Click Stop
5. Look for components with high render times or frequent renders

Only optimize what the profiler shows is actually slow.

## React.memo — Prevent Unnecessary Re-renders

\`React.memo\` wraps a component and skips re-rendering if props haven't changed:

\`\`\`js
const ExpensiveCard = React.memo(function ExpensiveCard({ title, value }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
});

// Now this only re-renders if title or value actually changes
\`\`\`

**When to use it:** Components that render often, receive the same props frequently, and are expensive to render (large lists, complex UI).

**When NOT to use it:** Simple components — the comparison overhead can cost more than the re-render.

## useMemo — Cache Expensive Computations

\`\`\`js
function ProductList({ products, filter }) {
  // Without useMemo: recalculates on EVERY render
  const filtered = products.filter(p => p.category === filter);

  // With useMemo: only recalculates when products or filter changes
  const filtered = useMemo(
    () => products.filter(p => p.category === filter),
    [products, filter]
  );

  return filtered.map(p => <ProductCard key={p.id} product={p} />);
}
\`\`\`

**Rule of thumb:** Only memoize computations that take > 1ms. For most simple filters/maps, useMemo adds overhead without benefit.

## useCallback — Stable Function References

Functions are recreated on every render. This breaks \`React.memo\` because a new function reference looks like a changed prop:

\`\`\`js
function Parent() {
  const [count, setCount] = useState(0);

  // Bad: new function on every render → Child always re-renders
  const handleClick = () => console.log('clicked');

  // Good: same reference across renders
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // empty deps = never recreated

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Parent: {count}</button>
      <MemoizedChild onClick={handleClick} />
    </>
  );
}

const MemoizedChild = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Child</button>;
});
\`\`\`

## Code Splitting with lazy()

Don't ship your entire app upfront. Split routes so users only download what they need:

\`\`\`js
import { lazy, Suspense } from 'react';

// These components are loaded only when needed
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings  = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings"  element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
\`\`\`

This alone can cut your initial bundle by 50%+.

## Virtualization for Long Lists

Never render 10,000 rows in the DOM. Use \`react-virtual\` or \`react-window\` to render only what's visible:

\`\`\`js
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // row height in px
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(vItem => (
          <div
            key={vItem.key}
            style={{ transform: \`translateY(\${vItem.start}px)\` }}
          >
            {items[vItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

Renders 20 items instead of 10,000 — massive DOM and memory savings.

## State Structure Tips

**Colocate state** — keep state as close to where it's used as possible. Global state that changes frequently causes your entire app to re-render.

\`\`\`js
// Bad: global state for local UI
const [isDropdownOpen, setIsDropdownOpen] = useGlobalStore();

// Good: local state stays local
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  // Only this component re-renders on toggle
}
\`\`\`

**Avoid object state for independent values:**

\`\`\`js
// Bad: changing name re-renders anything that reads email too
const [form, setForm] = useState({ name: '', email: '' });

// Good: independent state, independent renders (if split into components)
const [name, setName]   = useState('');
const [email, setEmail] = useState('');
\`\`\`

## Quick Wins Checklist

- ✅ Add \`key\` props to lists (use stable IDs, not array index)
- ✅ Avoid inline object/array/function props on frequently-rendered components
- ✅ Use \`React.memo\` on pure presentational components
- ✅ Split large bundles with \`React.lazy\`
- ✅ Virtualize lists over 100 items
- ✅ Move expensive context into separate providers
- ✅ Profile before and after every optimization

## Summary

Performance optimization in React is mostly about **controlling what re-renders and when**. The tools are simple — \`memo\`, \`useMemo\`, \`useCallback\`, \`lazy\` — but knowing *when* to reach for them is the skill.

Measure first. Optimize the bottleneck. Measure again.
    `,
};
