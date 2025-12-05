import { createRoot } from "react-dom/client";
import "@itsa-develop/itsa-fe-components/styles.css";
import "./styles.css";
import App from "./App.tsx";
import { ProviderApp } from "./Provider/ProviderApp.tsx";

createRoot(document.getElementById("root")!).render(
  <ProviderApp>
    <App />
  </ProviderApp>
);
