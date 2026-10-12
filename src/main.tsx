import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register Progressive Web App (PWA) Service Worker
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        console.log('Orca JP PWA Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('Orca JP Service Worker registration non-critical note:', err);
      });
  });
}
