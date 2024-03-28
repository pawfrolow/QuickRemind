import { makeAutoObservable } from 'mobx';
import i18next from 'i18next';
import dayjs from 'dayjs';
import { TNullable, TSettings } from 'renderer/types';

class CommonStore {
  settings: TNullable<TSettings> = null;

  constructor() {
    makeAutoObservable(this);

    window.electron.ipcRenderer.sendMessage('settings-get');
    window.electron.ipcRenderer.on('settings-get', (settings: any) => {
      this.settings = settings;
      i18next.changeLanguage(settings.language);
      dayjs.locale(settings.language);
    });
  }
}

export default new CommonStore();
