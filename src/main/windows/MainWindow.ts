import { ipcMain } from 'electron';
import { config } from 'main/config';
import { resolveHtmlPath } from 'main/utils';
import { MenuBuilder } from 'main/menu';
import { Window } from './Window';
import { windows } from './windows';
import { WindowsTypes } from '.';

export class MainWindow extends Window {
  constructor() {
    super({
      width: 500,
      height: 600,
      title: config.appName,
      show: false,
    });

    if (!this.window) {
      throw new Error('"mainWindow" is not defined');
    }

    this.window.loadURL(`${resolveHtmlPath('index.html')}`);

    this.window.on('ready-to-show', this.onReadyToShow);

    this.window.on('closed', this.clearWindow);

    ipcMain.on('page-inited', (event, type) => {
      if (type === 'main') {
        this.emitter = event;
      }
    });

    this.rebuildMenu();
  }

  onReadyToShow = () => {
    if (!this.window) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      this.window.minimize();
    } else {
      this.window.show();
    }
  };

  clearWindow = () => {
    this.window = null;
    (Object.keys(windows) as WindowsTypes[]).forEach((key) => {
      if (windows[key] && windows[key]?.window) {
        windows[key]?.window?.close();
      }
      windows[key] = null;
    });
  };

  rebuildMenu = () => {
    if (this.window) {
      this.menu = new MenuBuilder(this.window);
      this.menu.buildMenu();
    }
  };
}
