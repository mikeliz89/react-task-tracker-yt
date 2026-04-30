import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { Languages } from './utils/Languages';

// i18n configuration

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: [Languages.EN, Languages.FI],
    fallbackLng: Languages.FI,
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/assets/locales/{{lng}}/{{ns}}.json',
    },
    ns: ["common", "dashboard", "tasklist", "translation"],
    defaultNS: "translation",
    react: { useSuspense: false },
  });

export default i18n;
