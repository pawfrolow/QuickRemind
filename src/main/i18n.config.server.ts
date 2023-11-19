/* eslint-disable consistent-return */
/* eslint-disable no-console */
import i18next from 'i18next';
import I18NexFsBackend from 'i18next-fs-backend';
import { ipcMain } from 'electron';
import settings from '../../assets/settings/settings.json';
import config from './config';
import { windows } from './windows';
import { getAssetPath } from './utils';
import { tray } from './tray';

i18next.use(I18NexFsBackend).init(
  {
    initImmediate: false,
    lng: settings.language,
    fallbackLng: 'en',
    preload: ['en', 'ru'],
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: getAssetPath('locales/{{lng}}/{{ns}}.json'),
    },
  },
  (err) => {
    if (err) return console.error(err);
    console.log('i18next is ready...');
  },
);

ipcMain.on('get-initial-translations', (event) => {
  i18next.loadLanguages(config.languages, () => {
    const initial: Record<string, { translation: any }> = {};

    config.languages.forEach((language) => {
      initial[language] = {
        translation: i18next.getResourceBundle(language, 'translation'),
      };
    });
    event.returnValue = initial;
  });
});

ipcMain.on('language-changed', (_, language) => {
  i18next.changeLanguage(language);
  windows.main?.rebuildMenu();
  tray.main?.rebuildMenu();
  windows.settings!.window!.setTitle(i18next.t('main.window.settings.title'));
});
