import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en";
import ja from "@/locales/ja";

const languageTag = Localization.getLocales()[0]?.languageCode ?? "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
  },
  lng: languageTag,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
