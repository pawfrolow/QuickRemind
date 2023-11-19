import i18next from 'i18next';
import { ipcMain } from 'electron';
import { resolveHtmlPath } from '../utils';
import { Window } from './Window';
import { windows } from '../windows';

export class SettingsWindow extends Window {
  constructor() {
    super({
      width: 400,
      height: 240,
      resizable: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      show: false,
    });

    if (!this.window) {
      throw new Error('"settingsWindow" is not defined');
    }

    this.window.on('ready-to-show', () => {
      this.window!.show();
      this.window!.setTitle(i18next.t('main.window.settings.title'));
    });

    this.window.on('closed', this.clearWindow);

    this.window.loadURL(`${resolveHtmlPath('index.html')}?route=settings`);

    ipcMain.on('page-inited', (event, type) => {
      if (type === 'settings') {
        this.emitter = event;
      }
    });
  }

  clearWindow = () => {
    this.window = null;
    windows.settings = null;
  };
}
