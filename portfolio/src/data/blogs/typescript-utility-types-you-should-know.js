export default {
  slug: "typescript-utility-types-you-should-know",
  title: "TypeScript Utility Types Every Frontend Developer Should Know",
  date: "Feb 2026",
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
};
