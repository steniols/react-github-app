import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./custom.scss";
import App from "./App";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import common_en from "./translations/en/common.json";
import common_ptbr from "./translations/pt_br/common.json";

i18next.init({
  interpolation: { escapeValue: false },
  lng: "pt_br",
  defaultNS: "common",
  resources: {
    en: {
      common: common_en,
    },
    pt_br: {
      common: common_ptbr,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
