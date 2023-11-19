import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const initialI18nStore = window.electron.ipcRenderer.sendSync(
  'get-initial-translations',
);

i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: 'ru',
    fallbackLng: 'en',
    preload: ['en', 'ru'],
    ns: ['translation'],
    defaultNS: 'translation',
    resources: initialI18nStore,

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });
