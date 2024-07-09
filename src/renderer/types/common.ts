export type TSettings = {
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
};

export type TNullable<T> = T | null;

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
