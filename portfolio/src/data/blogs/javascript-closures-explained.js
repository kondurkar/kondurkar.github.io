export default {
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
};
