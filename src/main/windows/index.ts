import { MainWindow } from './MainWindow';
import { NotificationEditorWindow } from './NotificationEditorWindow';
import { SettingsWindow } from './SettingsWindow';
import { windows } from './windows';

export { Window } from './Window';

export type WindowsTypes = 'main' | 'settings' | 'notificationEditor';

export const openWindow = (name: WindowsTypes, payload?: string) => {
  if (!windows[name]) {
    switch (name) {
      case 'settings': {
        windows.settings = new SettingsWindow();
        break;
      }
      case 'notificationEditor': {
        windows.notificationEditor = new NotificationEditorWindow(payload);
        break;
      }
      default: {
        windows.main = new MainWindow();
        break;
      }
    }
    windows[name]?.window?.show();
  } else {
    windows[name]?.window!.focus();
  }
};

export { MainWindow, SettingsWindow, windows };
