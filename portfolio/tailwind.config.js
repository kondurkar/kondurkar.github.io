/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono:    ['"Share Tech Mono"', "monospace"],
        display: ["Syne", "sans-serif"],
        body:    ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
