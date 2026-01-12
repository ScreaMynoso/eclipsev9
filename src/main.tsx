import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

// Remove o selo do Lovable assim que o app carregar
setTimeout(() => {
  const badge = document.getElementById('lovable-badge-cta');
  if (badge) {
    badge.remove();
  }
}, 100);
