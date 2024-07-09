import i18next from 'i18next';
import { ipcMain } from 'electron';
import { resolveHtmlPath } from 'main/utils';
import { MenuBuilder } from 'main/menu';
import { Window } from './Window';
import { windows } from '.';

export class NotificationEditorWindow extends Window {
  constructor(payload?: string) {
    super({
      width: 540,
      height: 450,
      resizable: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      show: false,
    });

    if (!this.window) {
      throw new Error('"notificationEditorWindow" is not defined');
    }

    this.window.on('ready-to-show', () => {
      this.window!.show();
      this.window!.setTitle(i18next.t(`main.window.notificationEditor.title.${payload ? 'edit' : 'add'}`));
    });

    this.window.on('closed', this.clearWindow);

    this.window.loadURL(
      `${resolveHtmlPath('index.html')}?route=notificationEditor${payload ? `&payload=${payload}` : ''}`,
    );

    if (this.window) {
      this.menu = new MenuBuilder(this.window);
      this.menu.buildMenu();
    }

    ipcMain.on('page-inited', (event, type) => {
      if (type === 'notificationEditor') {
        this.emitter = event;
      }
    });
  }

  clearWindow = () => {
    this.window = null;
    windows.notificationEditor = null;
  };
}
