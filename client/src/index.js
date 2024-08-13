import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { store } from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { setDeferredPrompt } from "./app/pwaSlice"; // Update the import path as necessary

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

window.addEventListener("beforeinstallprompt", (e) => {
  console.log(e);
  e.preventDefault();
  store.dispatch(setDeferredPrompt(e)); // Store the event in Redux
});

reportWebVitals();
serviceWorkerRegistration.register();
