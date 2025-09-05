// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Configuração global de erros
window.addEventListener(
  "unhandledrejection",
  (event: PromiseRejectionEvent) => {
    console.error("Unhandled promise rejection:", event.reason);
  }
);

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
