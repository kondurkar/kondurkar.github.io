export default {
  slug: "pnpm-vs-npm-yarn-guide",
  title: "pnpm: The Package Manager Your node_modules Folder Deserves",
  date: "Aug 2026",
  readTime: "9 min read",
  tags: ["pnpm", "Tooling", "DevOps", "Performance"],
  excerpt:
    "npm and Yarn duplicate the same packages across every project on your machine. pnpm doesn't. Here's how its content-addressable store works, why installs are faster, and how to migrate an existing React project without breaking anything.",
  content: `
## The Problem pnpm Solves

Open any JavaScript project's \`node_modules\` folder and you'll find dozens of copies of the same package — different versions of \`lodash\`, \`react\`, \`postcss\` scattered across every dependency that needed them. Multiply that across every project on your machine and you're storing the same bytes on disk hundreds of times over.

npm and Yarn (in its default mode) both work this way: every project gets its own flat \`node_modules\` with real copies of every package.

pnpm doesn't. It stores every package version exactly once, globally, on your machine — then links to it from every project that needs it.

---

## How the Content-Addressable Store Works

pnpm keeps a single global store, typically at \`~/.local/share/pnpm/store\` (Linux) or \`~/Library/pnpm/store\` (macOS). When you install a package, pnpm:

1. Downloads the package once into the global store, keyed by content hash
2. Creates a **hard link** from the store into your project's \`node_modules/.pnpm\`
3. Builds a **symlinked** dependency tree so each package only sees its own declared dependencies

\`\`\`bash
# What actually lives on disk
~/.local/share/pnpm/store/v3/files/...   ← every package version, once

# What your project sees
node_modules/
  .pnpm/
    react@18.3.1/node_modules/react/     ← hard link, not a copy
    lodash@4.17.21/node_modules/lodash/  ← hard link, not a copy
  react -> .pnpm/react@18.3.1/node_modules/react
\`\`\`

Hard links mean zero extra disk space per project — a second project using the same \`react@18.3.1\` doesn't download or store it again, it just links to the same inode.

---

## The Strictness That Catches Real Bugs

npm and Yarn Classic flatten \`node_modules\`, which means a package can accidentally \`require()\` a dependency it never declared — as long as *something else* in your tree happens to have installed it. This is called **phantom dependencies**, and it's a silent footgun: your code works until that unrelated package removes or updates its own dependency, and your build breaks with no warning.

pnpm's symlinked structure makes this structurally impossible. If your code imports a package your \`package.json\` doesn't declare, pnpm throws immediately:

\`\`\`bash
Error: Cannot find module 'lodash'
require() of ES Module not supported
\`\`\`

This feels stricter, and it is — but it's catching bugs that npm and Yarn were letting through silently. If your project has been running fine on npm for years, a first pnpm install can surface phantom dependencies you didn't know you had.

---

## Real Numbers: Install Speed

On a cold cache, all three package managers hit the network and the difference is mostly network-bound. The gap shows up on **repeat installs** — CI runners, switching branches, or a second project on the same machine:

| Scenario | npm | Yarn | pnpm |
|---|---|---|---|
| Cold install (fresh machine) | Slowest | Fast | Fast |
| Repeat install (cache warm) | Slow — re-copies files | Faster — content cache | Fastest — hard links, no copy |
| Disk space (10 similar projects) | ~10x duplication | ~10x duplication | ~1x, shared store |

The disk-space difference is the more dramatic number in practice. A machine with 15 React projects using near-identical dependency trees can go from several GB of duplicated \`node_modules\` to a few hundred MB with pnpm, since almost everything hard-links back to the same store.

---

## Migrating an Existing Project

\`\`\`bash
# 1. Install pnpm globally
npm install -g pnpm

# 2. Remove the old lockfile and node_modules
rm -rf node_modules package-lock.json
# or: rm -rf node_modules yarn.lock

# 3. Install with pnpm
pnpm install
\`\`\`

This generates a \`pnpm-lock.yaml\` file — commit it the same way you'd commit \`package-lock.json\`.

**Common command translations:**

\`\`\`bash
npm install           → pnpm install
npm install react     → pnpm add react
npm install -D vitest → pnpm add -D vitest
npm run dev           → pnpm dev        # pnpm run is implied
npm run build         → pnpm build
npx eslint .          → pnpm dlx eslint .   # or: pnpm exec eslint .
\`\`\`

---

## Where It Trips People Up

**Phantom dependency errors on first install.** As above — pnpm's strictness surfaces bugs that were always there. Fix them by explicitly declaring what you import, don't work around them by loosening pnpm's config.

**Some older tools assume a flat \`node_modules\`.** A handful of legacy build tools or postinstall scripts expect to find nested packages the old flattened way. If you hit this, pnpm's \`shamefully-hoist=true\` setting in \`.npmrc\` restores flat-style resolution for compatibility, at the cost of losing the phantom-dependency protection.

\`\`\`ini
# .npmrc — escape hatch, not a default
shamefully-hoist=true
\`\`\`

**Monorepos work differently, but better.** pnpm has native **workspace** support (\`pnpm-workspace.yaml\`) that's arguably cleaner than Yarn or npm workspaces for cross-package linking — worth a dedicated look if you're managing multiple packages in one repo.

---

## Summary

| Tool | node_modules structure | Disk usage | Phantom deps |
|---|---|---|---|
| npm | Flat, real copies | Duplicated per project | Possible |
| Yarn Classic | Flat, real copies | Duplicated per project | Possible |
| pnpm | Symlinked, hard-linked store | Shared globally | Prevented |

pnpm isn't just "npm but faster" — the content-addressable store and strict dependency resolution change *what bugs are even possible*, not just how long \`install\` takes. For any new project, or a machine running more than a couple of JS repos, the disk savings alone make it worth the switch.
  `,
};
