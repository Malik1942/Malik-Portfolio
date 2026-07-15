import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { resolveTokenSourceCommit } from "./src/design-system/tokens/sourceCommit";

const tokenSourceCommit = resolveTokenSourceCommit(
  process.env.VERCEL_GIT_COMMIT_SHA,
);

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
