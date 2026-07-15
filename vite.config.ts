import { execFileSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const tokenSourceCommit =
  process.env.VERCEL_GIT_COMMIT_SHA ??
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();

// https://vitejs.dev/config/
export default defineConfig(() => ({
  define: {
    __MALIK_PORTFOLIO_DESIGN_TOKEN_SOURCE_COMMIT__: JSON.stringify(
      tokenSourceCommit,
    ),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
