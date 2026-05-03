import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <title>CAL-G</title>
    <link rel="icon" type="image/x-icon" href="public/logo.png"></link> <App />
  </StrictMode>,
);
