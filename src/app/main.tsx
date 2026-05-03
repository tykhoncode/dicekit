import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setupListeners } from "@reduxjs/toolkit/query";
import "@/app/styles/index.css";
// Side-effect import: runs the env schema (src/shared/config/env.ts) at
// boot. With an empty schema this is a no-op; the moment you add a
// VITE_* key, validation kicks in automatically.
import "@/shared/config";
import { App } from "@/app/App";
import { store } from "@/app/store";

setupListeners(store.dispatch);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
