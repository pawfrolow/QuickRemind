import { ipcMain } from 'electron';
import * as fs from 'fs';
import { getAssetPath, sendMessageToAllWindows } from 'main/utils';
import { windows } from 'main/windows';
import { TNullable, TSettings } from 'main/types';

const PATH_SETTINGS = `${getAssetPath()}/settings/settings.json`;

class SettingsController {
  settings: TNullable<TSettings> = null;

  constructor() {
    this.readSettings();
    ipcMain.on('settings-get', async (event) => {
      event.reply('settings-get', this.settings);
    });

    ipcMain.on('settings-save', async (_, settings) => {
      this.saveSettings(settings, () => {
        sendMessageToAllWindows('settings-get', settings);
        Object.values(windows).forEach((window) => {
          if (window && window.window) {
            window.window.webContents.send('settings-get', settings);
            window.window.setBackgroundColor(
              settings.theme === 'light' ? '#fff' : '#333',
            );
          }
        });
      });
    });
  }

  readSettings = () => {
    fs.readFile(PATH_SETTINGS, 'utf8', (error, data) => {
      if (error) throw error;

      this.settings = JSON.parse(data);
    });
  };

  saveSettings = (data: any, callback: () => void) => {
    this.settings = data;
    fs.writeFile(PATH_SETTINGS, JSON.stringify(data), (error) => {
      if (error) throw error;

      callback();
    });
  };
}

export default new SettingsController();
