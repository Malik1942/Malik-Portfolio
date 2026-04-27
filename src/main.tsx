import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Dismiss the loading screen once React has painted its first frame AND
// the web fonts are ready (or 3 s have elapsed — safety net for slow networks).
function dismissLoadingScreen() {
  const el = document.getElementById("loading-screen");
  if (!el) return;
  el.style.opacity = "0";
  el.style.pointerEvents = "none";
  // Unlock CSS animations and notify React components that fonts are ready.
  document.body.classList.add("loaded");
  window.dispatchEvent(new Event("page-loaded"));
  // Remove from DOM after the CSS transition finishes
  setTimeout(() => el.remove(), 500);
}

requestAnimationFrame(() => {
  Promise.race([
    document.fonts.ready,
    new Promise<void>((resolve) => setTimeout(resolve, 3000)),
  ]).then(dismissLoadingScreen);
});
