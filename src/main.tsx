import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;
const path = window.location.pathname.replace(/\/+$/, "") || "/";

// Prerendered public pages carry data-ssr="<path>": hydrate them. Anything else (app routes served by the
// SPA fallback) renders from scratch.
if (container.dataset.ssr === path && container.firstElementChild) {
  hydrateRoot(container, <App />);
} else {
  container.removeAttribute("data-ssr");
  container.innerHTML = "";
  createRoot(container).render(<App />);
}
