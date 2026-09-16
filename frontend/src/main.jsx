import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { setupMobileOptimizations } from "./utils/setupMobileOptimizations";

import { ProfileProvider } from "./context/ProfileContext";

setupMobileOptimizations();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProfileProvider>
      <App />
    </ProfileProvider>
  </React.StrictMode>
);
