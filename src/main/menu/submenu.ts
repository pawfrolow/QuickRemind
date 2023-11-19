import { Menu, MenuItemConstructorOptions, app, shell } from 'electron';
import i18next from 'i18next';
import config from '../config';
import { windows } from '../windows';
import { openWindow } from '../windows';
import { TNullable } from '../types';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

const isMacOs = process.platform === 'darwin';

export const getSubmenuAbout =
  (): TNullable<DarwinMenuItemConstructorOptions> => {
    if (isMacOs) {
      return {
        label: config.appName,
        submenu: [
          {
            label: i18next.t('main.menu.main.about'),
            selector: 'orderFrontStandardAboutPanel:',
          },
          { type: 'separator' },
          { label: i18next.t('main.menu.main.updates') },
          { type: 'separator' },
          {
            label: i18next.t('main.menu.main.settings'),
            click: () => openWindow('settings'),
          },
          { type: 'separator' },
          {
            label: i18next.t('main.menu.main.hide'),
            accelerator: 'Command+H',
            selector: 'hide:',
          },
          {
            label: i18next.t('main.menu.main.hideOthers'),
            accelerator: 'Command+Shift+H',
            selector: 'hideOtherApplications:',
          },
          { type: 'separator' },
          {
            label: i18next.t('main.menu.main.quit'),
            accelerator: 'Command+Q',
            click: () => {
              app.quit();
            },
          },
        ],
      };
    }

    return null;
  };

export const getSubmenuHelp = (): MenuItemConstructorOptions => ({
  label: i18next.t('main.menu.help.label'),
  submenu: [
    {
      label: i18next.t('main.menu.help.website'),
      click() {
        // TODO: change to product url
        shell.openExternal(config.website);
      },
    },
    {
      label: 'GitHub',
      click() {
        shell.openExternal(config.repository);
      },
    },
  ],
});

export const getSubmenuView = (): MenuItemConstructorOptions => ({
  label: i18next.t('main.menu.view.label'),
  submenu: [
    {
      label: i18next.t('main.menu.view.reload'),
      accelerator: isMacOs ? 'Command+R' : 'Ctrl+R',
      click: () => {
        windows.main!.window!.webContents.reload();
      },
    },
    {
      label: i18next.t('main.menu.view.fullScreen'),
      accelerator: isMacOs ? 'Ctrl+Command+F' : 'F11',
      click: () => {
        windows.main!.window!.setFullScreen(
          !windows.main!.window!.isFullScreen(),
        );
      },
    },
    {
      label: i18next.t('main.menu.view.devTools'),
      accelerator: isMacOs ? 'Alt+Command+I' : 'Alt+Ctrl+I',
      click: () => {
        windows.main!.window!.webContents.toggleDevTools();
      },
    },
  ],
});

export const getSubmenuWindow =
  (): TNullable<DarwinMenuItemConstructorOptions> => {
    if (isMacOs) {
      return {
        label: i18next.t('main.menu.window.label'),
        submenu: [
          {
            label: i18next.t('main.menu.window.minimize'),
            accelerator: 'Command+M',
            selector: 'performMiniaturize:',
          },
          {
            label: i18next.t('main.menu.window.close'),
            accelerator: 'Command+W',
            selector: 'performClose:',
          },
        ],
      };
    }
    return null;
  };
