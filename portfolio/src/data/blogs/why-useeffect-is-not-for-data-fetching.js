export default {
  slug: "why-useeffect-is-not-for-data-fetching",
  title: "Why useEffect Is Not the Right Tool for Data Fetching",
  date: "May 2025",
  readTime: "8 min read",
  tags: ["React", "Hooks", "Performance"],
  excerpt: "Most React developers reach for useEffect when they need to fetch data. It seems obvious — run a side effect, get data, set state. But this pattern causes subtle bugs, race conditions, and poor UX. Here's what to do instead.",
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
};
