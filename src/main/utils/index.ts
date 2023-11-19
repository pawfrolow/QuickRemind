import { URL } from 'url';
import path from 'path';
import { HandlerDetails, app, shell } from 'electron';
import { Channels } from '../preload';
import { windows } from '../windows';

export const DATE_FORMAT = 'DD.MM.YYYY HH:mm:ss';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export const getAssetPath = (...paths: string[]): string => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../../assets');

  return path.join(RESOURCES_PATH, ...paths);
};

export function selectAppIcon(): string {
  switch (process.platform) {
    case 'win32':
      return getAssetPath('icon.ico');
    case 'darwin':
      return getAssetPath('icon.icns');
    default:
      return getAssetPath('icon.png');
  }
}

export const onOpenUrl = (
  edata: HandlerDetails,
): { action: 'deny' | 'allow' } => {
  shell.openExternal(edata.url);
  return { action: 'deny' };
};

export const installExtensions = async () => {
  // eslint-disable-next-line global-require
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return (
    installer
      .default(
        extensions.map((name) => installer[name]),
        forceDownload,
      )
      // eslint-disable-next-line no-console
      .catch(console.log)
  );
};

export const sendMessageToAllWindows = (message: Channels, payload: any) => {
  Object.values(windows).forEach((window) => {
    if (window && window.window) {
      window.window.webContents.send(message, payload);
    }
  });
};

export function removeElem<T>(i: number, array: T[]): T[] {
  return array.filter((_, j) => i !== j);
}
