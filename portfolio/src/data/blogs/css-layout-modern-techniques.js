export default {
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
};
