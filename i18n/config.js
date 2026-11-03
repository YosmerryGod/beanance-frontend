import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import id from "./locales/id.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";
import vi from "./locales/vi.json";
import translationKeys from "./keys.json";

export { translationKeys };

export const supportedLanguages = [
  { code: "en", label: "English", native: "English", flag: "EN" },
  { code: "zh", label: "Chinese", native: "简体中文", flag: "CN" },
  { code: "id", label: "Indonesian", native: "Bahasa Indonesia", flag: "ID" },
  { code: "ja", label: "Japanese", native: "日本語", flag: "JP" },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt", flag: "VN" },
];

export const sidebarTranslations = {
  en: en.sidebar,
  id: id.sidebar,
  zh: zh.sidebar,
  ja: ja.sidebar,
  vi: vi.sidebar,
};

const resources = {
  en: { translation: en.app },
  id: { translation: id.app },
  zh: { translation: zh.app },
  ja: { translation: ja.app },
  vi: { translation: vi.app },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    keySeparator: false,
    interpolation: { escapeValue: false },
    initImmediate: false,
  });
}

export default i18n;
