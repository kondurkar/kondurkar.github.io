export const BLOGS = [
  {
    slug: "why-useeffect-is-not-for-data-fetching",
    title: "Why useEffect Is Not the Right Tool for Data Fetching",
    date: "May 2025",
    readTime: "8 min read",
    tags: ["React", "Hooks", "Performance"],
    excerpt:
      "Most React developers reach for useEffect when they need to fetch data. It seems obvious — run a side effect, get data, set state. But this pattern causes subtle bugs, race conditions, and poor UX. Here's what to do instead.",
    content: `
## The Problem with useEffect for Data Fetching

Most React developers write something like this early in their career:

\`\`\`js
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <Spinner />;
  return <div>{user.name}</div>;
}
\`\`\`

This looks fine. But it has serious problems hiding underneath.

## Problem 1: Race Conditions

If \`userId\` changes quickly — like a user clicking through profiles — multiple fetches fire. There's no guarantee they resolve in order. The last render might show data from an earlier request.

\`\`\`js
// userId changes: 1 → 2 → 3
// Fetch for userId=1 resolves LAST
// You're now showing wrong data!
\`\`\`

## Problem 2: No Request Cancellation

When the component unmounts mid-fetch, the callback still runs and tries to call \`setUser\` on an unmounted component. React 18 handles this more gracefully, but it's still a footgun.

\`\`\`js
useEffect(() => {
  let cancelled = false;

  fetch(\`/api/users/\${userId}\`)
    .then(res => res.json())
    .then(data => {
      if (!cancelled) setUser(data); // guard added
    });

  return () => { cancelled = true; }; // cleanup
}, [userId]);
\`\`\`

Now your simple data fetch needs a cancellation flag, error handling, loading state, and empty state. That's a lot of boilerplate.

## Problem 3: Waterfalls

useEffect fires *after* render. So your component renders once with no data, triggers a fetch, then renders again with data. If a child component also fetches, you get a waterfall — each level waits for its parent to render before starting its own fetch.

## The Right Alternatives

### 1. React Query / TanStack Query

The gold standard for server state in React:

\`\`\`js
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(\`/api/users/\${userId}\`).then(r => r.json()),
  });

  if (isLoading) return <Spinner />;
  return <div>{user.name}</div>;
}
\`\`\`

You get caching, deduplication, background refetching, race condition handling — all for free.

### 2. React Suspense + use()

React 18 introduced the \`use()\` hook for reading promises:

\`\`\`js
function UserProfile({ userId }) {
  const user = use(fetchUser(userId)); // suspends until resolved
  return <div>{user.name}</div>;
}

// Wrap with Suspense boundary
<Suspense fallback={<Spinner />}>
  <UserProfile userId={1} />
</Suspense>
\`\`\`

### 3. Next.js Server Components

If you're on Next.js 13+, just fetch directly in a server component — no hooks, no loading state, no waterfalls:

\`\`\`js
async function UserProfile({ userId }) {
  const user = await fetch(\`/api/users/\${userId}\`).then(r => r.json());
  return <div>{user.name}</div>;
}
\`\`\`

## When IS useEffect Appropriate?

useEffect is great for:
- Syncing with non-React systems (DOM APIs, third-party libraries)
- Setting up subscriptions (WebSockets, event listeners)
- Triggering animations after render

It's **not** a data fetching primitive. Treat it that way and your code will be cleaner, faster, and far more predictable.

## Summary

| Approach | Race conditions | Caching | DX |
|---|---|---|---|
| Raw useEffect | ❌ Manual | ❌ None | 😔 |
| React Query | ✅ Handled | ✅ Built-in | 😍 |
| Suspense/use() | ✅ Handled | ⚠️ Depends | 😊 |
| Server Components | ✅ N/A | ✅ Built-in | 😍 |

Stop reaching for useEffect when you need data. Your future self will thank you.
    `,
  },
  {
    slug: "javascript-closures-explained",
    title: "JavaScript Closures: The Concept Every Developer Must Master",
    date: "Apr 2025",
    readTime: "7 min read",
    tags: ["JavaScript", "Fundamentals", "Scope"],
    excerpt:
      "Closures are one of the most powerful — and most misunderstood — features of JavaScript. Once you truly get them, a huge chunk of the language suddenly makes sense: event handlers, factory functions, React hooks, and more.",
    content: `
## What Is a Closure?

A closure is a function that **remembers the variables from the scope where it was created**, even after that outer scope has finished executing.

Here's the simplest possible example:

\`\`\`js
function makeCounter() {
  let count = 0; // this variable lives in makeCounter's scope

  return function () {
    count++; // inner function "closes over" count
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
\`\`\`

\`makeCounter\` has finished running, but \`count\` is still alive — because the returned function holds a reference to it. That's a closure.

## Why Does This Work?

JavaScript uses **lexical scoping** — a function's scope is determined by where it's *written* in the code, not where it's *called*.

When the JavaScript engine creates a function, it attaches the surrounding scope as the function's **[[Environment]]** reference. This is what keeps the outer variables alive.

\`\`\`js
function outer() {
  const message = "hello";

  function inner() {
    console.log(message); // lexically scoped to outer
  }

  return inner;
}

const fn = outer();
fn(); // "hello" — message is still accessible
\`\`\`

## Real-World Use Cases

### 1. Data Privacy / Encapsulation

\`\`\`js
function createBankAccount(initialBalance) {
  let balance = initialBalance; // private!

  return {
    deposit(amount) { balance += amount; },
    withdraw(amount) { balance -= amount; },
    getBalance() { return balance; },
  };
}

const account = createBankAccount(1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
console.log(account.balance);      // undefined — truly private
\`\`\`

### 2. Function Factories

\`\`\`js
function multiplier(factor) {
  return (number) => number * factor;
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
\`\`\`

### 3. Event Handlers

\`\`\`js
function attachHandlers() {
  const buttons = document.querySelectorAll('button');

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      console.log(\`Button \${index} clicked\`); // closes over index
    });
  });
}
\`\`\`

### 4. React Hooks

Every React hook relies on closures. When you write:

\`\`\`js
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1); // closes over the current count value
  };

  return <button onClick={handleClick}>{count}</button>;
}
\`\`\`

\`handleClick\` closes over \`count\` from the current render. This is why stale closures in hooks can be a bug — the handler captures an old value of \`count\`.

## The Classic Closure Bug

\`\`\`js
// Bug: all log the same value
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000); // 3, 3, 3
}

// Fix 1: use let (block scope)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000); // 0, 1, 2
}

// Fix 2: use a closure factory
for (var i = 0; i < 3; i++) {
  ((j) => {
    setTimeout(() => console.log(j), 1000); // 0, 1, 2
  })(i);
}
\`\`\`

\`var\` is function-scoped, so all three callbacks share the same \`i\`. \`let\` creates a new binding per iteration — problem solved.

## Memory Considerations

Closures keep their outer scope alive. If you're not careful, this can cause memory leaks:

\`\`\`js
function heavyOperation() {
  const largeData = new Array(1000000).fill('data');

  return function () {
    // largeData stays in memory as long as this function exists
    return largeData[0];
  };
}
\`\`\`

Always clean up closures that hold large references — especially in event listeners and subscriptions.

## Summary

- A closure is a function + its surrounding lexical environment
- Closures enable data privacy, factory functions, and stateful callbacks
- React hooks are fundamentally built on closures
- Watch out for stale closures in async code and the classic \`var\` loop bug

Once closures click, JavaScript starts to feel like a much more intentional and powerful language.
    `,
  },
  {
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
  },
  {
    slug: "typescript-utility-types-you-should-know",
    title: "TypeScript Utility Types Every Frontend Developer Should Know",
    date: "Feb 2025",
    readTime: "6 min read",
    tags: ["TypeScript", "JavaScript", "Types"],
    excerpt:
      "TypeScript ships with a set of built-in utility types that let you transform and compose types without duplicating code. These are the ones I use almost every day and why they matter.",
    content: `
## Why Utility Types Matter

Instead of manually rewriting types, TypeScript gives you tools to derive new types from existing ones. This keeps your type definitions DRY, in sync, and far easier to maintain.

## Partial\<T\> — Make All Properties Optional

\`\`\`ts
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// For update endpoints — you only send what changed
function updateUser(id: number, changes: Partial<User>) {
  // changes can have any subset of User's properties
}

updateUser(1, { name: 'Yogesh' });         // ✅
updateUser(1, { name: 'Y', email: 'y@y' }); // ✅
\`\`\`

## Required\<T\> — Make All Properties Required

The opposite of Partial. Useful when you know a fully-hydrated object must have everything:

\`\`\`ts
interface DraftPost {
  title?: string;
  content?: string;
  slug?: string;
}

// Before publishing, all fields must exist
function publishPost(post: Required<DraftPost>) {
  // title, content, slug are all guaranteed here
}
\`\`\`

## Pick\<T, K\> — Select Specific Properties

\`\`\`ts
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  createdAt: Date;
}

// Card only needs a subset
type ProductCardProps = Pick<Product, 'id' | 'name' | 'price'>;

function ProductCard({ id, name, price }: ProductCardProps) {
  return <div>{name} — ₹{price}</div>;
}
\`\`\`

## Omit\<T, K\> — Exclude Specific Properties

The inverse of Pick:

\`\`\`ts
// When creating a user, we don't have an ID yet
type CreateUserPayload = Omit<User, 'id'>;

function createUser(payload: CreateUserPayload) {
  // id is not required here
}

// Useful for forms too
type UserFormValues = Omit<User, 'id' | 'createdAt'>;
\`\`\`

## Record\<K, V\> — Type-Safe Key-Value Maps

\`\`\`ts
type Status = 'active' | 'inactive' | 'pending';

// Every status must have a label and color
const statusConfig: Record<Status, { label: string; color: string }> = {
  active:   { label: 'Active',   color: 'green' },
  inactive: { label: 'Inactive', color: 'red'   },
  pending:  { label: 'Pending',  color: 'amber' },
  // TypeScript errors if you miss one or add a wrong key
};
\`\`\`

## ReturnType\<T\> — Infer a Function's Return Type

\`\`\`ts
function getUser() {
  return { id: 1, name: 'Yogesh', role: 'admin' as const };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string; role: 'admin' }

// Great for inferring types from selectors or API functions
function useUserStore() {
  return { user: null, loading: false, error: null };
}

type UserStore = ReturnType<typeof useUserStore>;
\`\`\`

## Parameters\<T\> — Infer Function Parameters

\`\`\`ts
function createEvent(name: string, date: Date, attendees: string[]) {
  // ...
}

type EventParams = Parameters<typeof createEvent>;
// [name: string, date: Date, attendees: string[]]

// Useful for wrapper functions
function logAndCreateEvent(...args: Parameters<typeof createEvent>) {
  console.log('Creating event:', args[0]);
  return createEvent(...args);
}
\`\`\`

## NonNullable\<T\> — Remove null and undefined

\`\`\`ts
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string

// Useful after null checks
function processValue(val: string | null) {
  if (!val) return;
  // val is now NonNullable<typeof val> = string
  doSomething(val);
}
\`\`\`

## Combining Utility Types

The real power comes from composing them:

\`\`\`ts
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

// A partial update response — data optional, no timestamp
type UpdateResponse<T> = Omit<Partial<ApiResponse<T>>, 'timestamp'>;

// Form state — everything optional, id excluded
type FormState<T> = Partial<Omit<T, 'id'>>;
\`\`\`

## Summary

| Utility | What it does |
|---|---|
| \`Partial<T>\` | All props optional |
| \`Required<T>\` | All props required |
| \`Pick<T, K>\` | Keep only K props |
| \`Omit<T, K>\` | Remove K props |
| \`Record<K, V>\` | Map of K keys to V values |
| \`ReturnType<T>\` | Infer function return type |
| \`Parameters<T>\` | Infer function param types |
| \`NonNullable<T>\` | Remove null/undefined |

These eight utility types alone will dramatically reduce type duplication in any real TypeScript codebase.
    `,
  },
  {
    slug: "css-layout-modern-techniques",
    title: "Modern CSS Layout: Flexbox vs Grid — When to Use Which",
    date: "Jan 2025",
    readTime: "7 min read",
    tags: ["CSS", "Layout", "Frontend"],
    excerpt:
      "Flexbox and CSS Grid are both powerful layout tools — but they're designed for different problems. Knowing when to reach for each one will make your CSS cleaner, more predictable, and easier to maintain.",
    content: `
## The Core Difference

The fundamental difference is one sentence:

- **Flexbox** is for **one-dimensional** layouts — a row OR a column
- **Grid** is for **two-dimensional** layouts — rows AND columns simultaneously

Everything else flows from this distinction.

## Flexbox — When Layout Flows in One Direction

Use Flexbox when you're aligning items along a single axis:

\`\`\`css
/* Navigation bar — items in a row */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* Card content — stacked vertically */
.card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Push footer to bottom of card */
.card-footer {
  margin-top: auto; /* flex magic */
}
\`\`\`

Flexbox shines when:
- You don't know how many items there will be
- Items should wrap naturally to the next line
- You need to distribute space between items
- Content drives the size of containers

\`\`\`css
/* Tag cloud — unknown number of tags */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Items grow to fill available space */
.nav-link {
  flex: 1; /* all nav links equal width */
}
\`\`\`

## CSS Grid — When Layout Needs Two Dimensions

Use Grid when you're thinking about both rows and columns at the same time:

\`\`\`css
/* Classic page layout */
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 64px 1fr auto;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
  min-height: 100vh;
}

.sidebar { grid-area: sidebar; }
.header  { grid-area: header;  }
.main    { grid-area: main;    }
.footer  { grid-area: footer;  }
\`\`\`

\`\`\`css
/* Responsive card grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
/* No media queries needed — automatically responsive! */
\`\`\`

Grid shines when:
- You're designing the overall page structure
- Items need to align across both rows AND columns
- You want precise placement control
- You need items to span multiple rows/columns

\`\`\`css
/* Featured article spans two columns */
.article:first-child {
  grid-column: span 2;
  grid-row: span 2;
}
\`\`\`

## Side-by-Side Comparison

\`\`\`css
/* FLEXBOX: items control their own size */
.flex-container {
  display: flex;
  gap: 1rem;
}
.flex-item {
  flex: 1 1 200px; /* grow, shrink, basis */
}

/* GRID: container controls item placement */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1rem;
}
/* Items go where the grid puts them */
\`\`\`

## Common Patterns

### Holy Grail Layout — Grid

\`\`\`css
.layout {
  display: grid;
  grid-template:
    "header header header" 64px
    "nav    main   aside"  1fr
    "footer footer footer" auto
    / 200px 1fr 200px;
}
\`\`\`

### Centered Content — Either Works

\`\`\`css
/* Flexbox */
.center-flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Grid */
.center-grid {
  display: grid;
  place-items: center; /* shorthand for both axes */
}
\`\`\`

### Sidebar Layout — Grid

\`\`\`css
.with-sidebar {
  display: grid;
  grid-template-columns: min(30%, 300px) 1fr;
  gap: 2rem;
}
\`\`\`

### Button Group — Flexbox

\`\`\`css
.btn-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
\`\`\`

## Nesting: Use Both Together

There's no rule against using Grid for the outer layout and Flexbox inside components:

\`\`\`css
/* Grid for page structure */
.page { display: grid; grid-template-columns: 1fr 3fr; }

/* Flexbox inside each card */
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
\`\`\`

This is the most common real-world pattern — Grid for macro layout, Flexbox for micro layout.

## Decision Framework

Ask yourself:

1. **Am I arranging items in one direction?** → Flexbox
2. **Am I building a two-dimensional structure?** → Grid
3. **Do I want content to drive container size?** → Flexbox
4. **Do I want the container to control item placement?** → Grid
5. **Is it a component (button, card, nav)?** → Flexbox
6. **Is it a page or section layout?** → Grid

## Summary

Neither is better — they solve different problems. A typical production app uses Grid for page structure and Flexbox inside every component. Master both and you'll rarely need any CSS framework for layout.
    `,
  },
];
