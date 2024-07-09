import { BrowserWindow, BrowserWindowConstructorOptions, IpcMainEvent, app } from 'electron';
import { settingsController } from 'main/controllers';
import { MenuBuilder } from 'main/menu';
import { TNullable } from 'main/types';
import { onOpenUrl, selectAppIcon } from 'main/utils';
import path from 'path';

export abstract class Window {
  window: TNullable<BrowserWindow> = null;

  menu: TNullable<MenuBuilder> = null;

  emitter: TNullable<IpcMainEvent> = null;

  constructor(options?: BrowserWindowConstructorOptions) {
    this.window = new BrowserWindow({
      icon: selectAppIcon(),
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../../.erb/dll/preload.js'),
      },
      backgroundColor: settingsController.settings?.theme === 'light' ? '#fff' : '#333',
      ...options,
    });

    // Open urls in the user's browser
    this.window.webContents.setWindowOpenHandler(onOpenUrl);
  }
}
