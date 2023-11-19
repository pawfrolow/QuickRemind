import { MainWindow, SettingsWindow } from '../windows';
import { NotificationEditorWindow } from '../windows/NotificationEditorWindow';

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

export type TNotification = {
  title: string;
  description: string;
  repeat: boolean;
  repeatNumber: number;
  repeatPeriod: 'minute' | 'hour' | 'day' | 'week';
  date: string;
};
