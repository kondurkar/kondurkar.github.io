import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Set base to "/" for a user/org GitHub Pages site (username.github.io)
// Set base to "/repo-name/" for a project site (username.github.io/repo-name)
export default defineConfig({
  plugins: [react()],
  base: "/portfolio/",
});
