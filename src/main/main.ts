/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import './i18n.config.server';
import { app, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import calendar from 'dayjs/plugin/calendar';
import dayjs from 'dayjs';
import en from 'dayjs/locale/en';
import { MainWindow, WindowsTypes, openWindow, windows } from 'main/windows';
import { TrayBuilder, tray } from 'main/tray';
import { installExtensions } from 'main/utils';
import { config } from 'main/config';

dayjs.locale({
  ...en,
  weekStart: 1,
});

dayjs.extend(customParseFormat);
dayjs.extend(calendar);

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

ipcMain.on('open-page', async (_, page: WindowsTypes, payload?: string) => {
  openWindow(page, payload);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

/* if (isDebug) {
  require('electron-debug')();
} */

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  windows.main = new MainWindow();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.setLoginItemSettings({
  openAtLogin: true,
});

app.setAboutPanelOptions({
  applicationName: config.appName,
  version: '',
  authors: ['Pavel Frolov'],
  website: config.website,
});

app
  .whenReady()
  .then(() => {
    createWindow();
    tray.main = new TrayBuilder();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (!windows.main) createWindow();
    });
  })
  .catch(console.log);
