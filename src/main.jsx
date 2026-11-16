import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { FitFlowProvider } from "./context/FitFlowContext";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <FitFlowProvider>
        <App />
      </FitFlowProvider>
    </BrowserRouter>
  </StrictMode>,
);
