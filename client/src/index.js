import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./custom.scss";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import common_en from "./translations/en/common.json";
import common_ptbr from "./translations/pt_br/common.json";

i18next.init({
  interpolation: { escapeValue: false },
  lng: "pr_br",
  resources: {
    en: {
      common: common_en,
    },
    pr_br: {
      common: common_ptbr,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
