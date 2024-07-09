import { MainWindow, SettingsWindow } from 'main/windows';
import { NotificationEditorWindow } from 'main/windows/NotificationEditorWindow';

export type TNullable<T> = T | null;

export type TWindows = {
  main: TNullable<MainWindow>;
  settings: TNullable<SettingsWindow>;
  notificationEditor: TNullable<NotificationEditorWindow>;
};

export type TChannels =
  | 'open-page'
  | 'get-initial-translations'
  | 'settings-get'
  | 'settings-save'
  | 'language-changed'
  | 'page-init';

export type TSettings = {
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
};

export type TRepeat = {
  number: string;
  period: 'minute' | 'hour' | 'day' | 'week';
};

export type TNotification = {
  title: string;
  description: string;
  date: string;
  repeat: TNullable<TRepeat>;
};
