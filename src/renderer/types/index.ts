export type TSettings = {
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
};

export type TNullable<T> = T | null;

export type TNotification = {
  title: string;
  description: string;
  repeat: boolean;
  repeatNumber: number;
  repeatPeriod: 'minute' | 'hour' | 'day' | 'week';
  date: string;
};
