export default {
  slug: "git-pre-commit-hooks-explained",
  title: "Git Pre-Commit Hooks: Catch Bugs Before They Ever Hit the Repo",
  date: "Jun 2025",
  readTime: "8 min read",
  tags: ["Git", "DevOps", "Tooling", "JavaScript"],
  excerpt:
    "Pre-commit hooks run automatically before every git commit — linting your code, running tests, formatting files, and blocking bad commits before they ever touch your repository. Here's everything you need to know to set them up properly.",
  content: `
## What Is a Git Hook?

Git hooks are scripts that Git runs automatically at specific points in your workflow. They live in the \`.git/hooks/\` folder of every repository.

There are hooks for almost every Git action:
- \`pre-commit\` — runs before a commit is created
- \`commit-msg\` — validates the commit message
- \`pre-push\` — runs before code is pushed to remote
- \`post-merge\` — runs after a merge completes

The most useful one for frontend developers is \`pre-commit\` — it's your last line of defence before broken code enters the repo.

---

## Why Pre-Commit Hooks?

Without hooks, this is a common scenario:

\`\`\`bash
git add .
git commit -m "fix button styles"
git push

# 2 minutes later in CI:
# ❌ ESLint: 14 errors
# ❌ Tests: 3 failures
# ❌ Build: failed
\`\`\`

Pre-commit hooks catch this locally, immediately, before it wastes anyone else's time.

\`\`\`bash
git commit -m "fix button styles"
# ✋ Pre-commit hook running...
# ❌ ESLint: no-unused-vars in Button.tsx (line 12)
# Commit blocked. Fix errors and try again.
\`\`\`

The feedback loop shrinks from minutes (CI pipeline) to seconds (your terminal).

---

## The Manual Way — Raw Shell Script

Every Git repo already has a hooks directory. You can add a pre-commit hook manually:

\`\`\`bash
# Create the hook file
touch .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit
\`\`\`

\`\`\`bash
#!/bin/sh
# .git/hooks/pre-commit

echo "Running pre-commit checks..."

# Run ESLint on staged JS/TS files
npx eslint --ext .js,.jsx,.ts,.tsx $(git diff --cached --name-only)

# If ESLint exits with a non-zero code, abort the commit
if [ $? -ne 0 ]; then
  echo "❌ ESLint failed. Commit blocked."
  exit 1
fi

echo "✅ All checks passed."
exit 0
\`\`\`

**The problem:** \`.git/hooks/\` is not tracked by Git. Every developer on your team has to set this up manually. That's not scalable.

---

## The Right Way — Husky

**Husky** is the standard tool for managing Git hooks in JavaScript projects. It stores hooks in your repo (tracked by Git) and installs them automatically when someone runs \`npm install\`.

### Setup

\`\`\`bash
npm install --save-dev husky
npx husky init
\`\`\`

This creates a \`.husky/\` folder with a sample \`pre-commit\` file and adds an \`npm prepare\` script that installs hooks automatically.

Your \`package.json\` will have:

\`\`\`json
{
  "scripts": {
    "prepare": "husky"
  }
}
\`\`\`

Now every developer who clones the repo and runs \`npm install\` gets the hooks automatically. Zero manual setup.

---

## lint-staged — Only Lint What Changed

Running ESLint across your entire codebase on every commit is slow. **lint-staged** solves this by only running checks on files that are actually staged.

\`\`\`bash
npm install --save-dev lint-staged
\`\`\`

Add to \`package.json\`:

\`\`\`json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss}": [
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
\`\`\`

Update your \`.husky/pre-commit\` hook:

\`\`\`bash
#!/bin/sh
npx lint-staged
\`\`\`

Now only staged files get linted and formatted. A commit touching 2 files runs checks on 2 files — not 200.

---

## Full Setup: ESLint + Prettier + TypeScript + Tests

Here's a production-ready pre-commit hook configuration:

\`\`\`bash
# Install everything
npm install --save-dev husky lint-staged eslint prettier typescript
npx husky init
\`\`\`

**\`package.json\`:**
\`\`\`json
{
  "scripts": {
    "prepare":     "husky",
    "lint":        "eslint . --ext .ts,.tsx,.js,.jsx",
    "format":      "prettier --write .",
    "type-check":  "tsc --noEmit",
    "test":        "vitest run"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix --max-warnings=0",
      "prettier --write"
    ],
    "*.{css,scss,md,json}": [
      "prettier --write"
    ]
  }
}
\`\`\`

**\`.husky/pre-commit\`:**
\`\`\`bash
#!/bin/sh
set -e

echo "🔍 Running lint-staged..."
npx lint-staged

echo "🔷 Running TypeScript check..."
npx tsc --noEmit

echo "✅ Pre-commit checks passed!"
\`\`\`

The \`set -e\` at the top means the script aborts immediately if any command fails.

---

## commit-msg Hook — Enforce Commit Message Format

If your team follows Conventional Commits (\`feat:\`, \`fix:\`, \`chore:\` etc.), you can enforce it with a \`commit-msg\` hook:

\`\`\`bash
# .husky/commit-msg
#!/bin/sh

COMMIT_MSG=$(cat "$1")
PATTERN="^(feat|fix|chore|docs|style|refactor|test|perf|ci|build|revert)(\\([a-z-]+\\))?: .+"

if ! echo "$COMMIT_MSG" | grep -qE "$PATTERN"; then
  echo ""
  echo "❌ Invalid commit message format."
  echo "   Expected: feat(scope): description"
  echo "   Examples:"
  echo "     feat(auth): add JWT refresh token"
  echo "     fix(button): correct hover state on mobile"
  echo "     chore: update dependencies"
  echo ""
  exit 1
fi
\`\`\`

Now \`git commit -m "fixed stuff"\` gets blocked, but \`git commit -m "fix(button): correct hover state"\` goes through.

---

## Bypassing Hooks When You Need To

Sometimes you genuinely need to commit without running hooks — a WIP commit, an emergency fix, or debugging the hooks themselves:

\`\`\`bash
# Skip all hooks for this commit
git commit -m "wip: debugging" --no-verify
\`\`\`

Use sparingly. \`--no-verify\` is a tool, not a habit.

---

## Common Pre-Commit Hook Recipes

**Run only unit tests related to changed files (Vitest):**
\`\`\`bash
npx vitest run --changed
\`\`\`

**Check for console.log statements:**
\`\`\`bash
#!/bin/sh
if git diff --cached | grep -E "console\\.log" > /dev/null; then
  echo "❌ console.log found in staged files. Remove before committing."
  exit 1
fi
\`\`\`

**Prevent committing directly to main:**
\`\`\`bash
#!/bin/sh
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  echo "❌ Direct commits to $BRANCH are not allowed."
  echo "   Create a feature branch: git checkout -b feat/your-feature"
  exit 1
fi
\`\`\`

**Check for TODO/FIXME in staged files:**
\`\`\`bash
#!/bin/sh
if git diff --cached | grep -E "TODO:|FIXME:" > /dev/null; then
  echo "⚠️  TODO/FIXME found in staged files."
  echo "   Resolve or remove them before committing."
  exit 1
fi
\`\`\`

---

## React + Vite Project: Complete Setup

Here's the exact setup I use in React + TypeScript + Vite projects:

\`\`\`bash
npm install --save-dev husky lint-staged
npx husky init
\`\`\`

**\`.husky/pre-commit\`:**
\`\`\`bash
#!/bin/sh
npx lint-staged && npx tsc --noEmit
\`\`\`

**\`package.json\`:**
\`\`\`json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --fix --max-warnings=0",
      "prettier --write"
    ],
    "src/**/*.{css,json}": [
      "prettier --write"
    ]
  }
}
\`\`\`

From the moment a new developer clones the repo and runs \`npm install\`, they have the same hooks running as everyone else. No docs to read, no manual setup, no exceptions.

---

## Summary

| Tool | What it does |
|---|---|
| \`git hooks\` | Native Git mechanism — scripts in \`.git/hooks/\` |
| \`husky\` | Manages hooks in your repo, installs automatically on \`npm install\` |
| \`lint-staged\` | Runs linters only on staged files — fast |
| \`eslint --fix\` | Auto-fixes fixable lint errors before blocking |
| \`prettier --write\` | Auto-formats code before committing |
| \`tsc --noEmit\` | Type-checks without emitting files |

Pre-commit hooks are one of the highest-leverage tools in a frontend developer's workflow. Five minutes of setup saves hours of CI debugging and code review back-and-forth. Set them up once, and your whole team benefits automatically.
  `,
};
