import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Half the logical cores, not all of them. The suite is 52 jsdom files, and
    // on a 12-logical / 6-performance-core Mac the default fans out to 12
    // forks that thrash each other: measured Sep 2026, wall time was flat at
    // ~21s from 4 to 12 workers, while the slowest single test went from
    // 1.4s at 4 to 5.5s at 12 and tripped the 5s timeout on an idle machine.
    // Fewer workers costs nothing and gives every test back its margin.
    maxWorkers: "50%",
    projects: [
      {
        extends: true,
        test: {
          name: "browser",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./src/test/setup.ts"],
          include: ["src/**/*.{test,spec}.{ts,tsx}"],
          passWithNoTests: true,
        },
      },
      {
        extends: true,
        test: {
          name: "api",
          environment: "node",
          globals: true,
          include: ["api/**/*.{test,spec}.ts"],
          passWithNoTests: true,
        },
      },
    ],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
