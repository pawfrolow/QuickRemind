import { URL } from 'url';
import path from 'path';
import { HandlerDetails, app, shell } from 'electron';
import dayjs from 'dayjs';
import { Channels } from 'main/preload';
import { windows } from 'main/windows';
import { TNotification } from 'main/types';

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

export const getDateByTime = (hours: number, minutes: number) => {
  return dayjs().set('hour', +hours).set('minute', +minutes).set('second', 0);
};

export const calculateNextDate = (notification: TNotification): string => {
  let date = dayjs(notification.date, DATE_FORMAT);

  while (date.isBefore(dayjs())) {
    // Догоняем до настоящего времени
    date = date.add(+notification.repeat!.number, notification.repeat!.period);
  }

  const isMissedWeekday = !notification.repeat?.days.includes(date.day());

  if (isMissedWeekday) {
    // сколько дней до ближайшего указанного дня
    const nextWeekday =
      notification.repeat?.days
        // дни недели по порядку
        .sort((a, b) => a - b)
        // находим следующий день или первый из указанных, если после нету
        .filter((day) => day > date.day())[0] ??
      (notification.repeat?.days[0] as number);
    let days = 0;
    if (date.day() > nextWeekday) {
      // сколько от конца недели + сколько дней с начала следующей
      days = Math.abs(7 - date.day() + nextWeekday);
    } else {
      // разница в днях до следующего доступного дня
      days = Math.abs(nextWeekday - date.day());
    }
    date = date.add(days, 'day');

    if (
      notification.repeat?.silentPeriod[0] &&
      notification.repeat?.silentPeriod[1]
    ) {
      const hours = +notification.repeat.silentPeriod[1].split(':')[0];
      const minutes = +notification.repeat.silentPeriod[1].split(':')[1];
      date.set('hour', hours).set('minute', minutes).set('second', 0);
    }
  }

  if (
    notification.repeat?.silentPeriod[0] &&
    notification.repeat?.silentPeriod[1]
  ) {
    const { silentPeriod } = notification.repeat;
    const isSameDay =
      +silentPeriod[1]!.split(':')[0] > +silentPeriod[0]!.split(':')[0];

    const [hoursOne, minutesOne] = silentPeriod[0]!.split(':');
    const [hoursTwo, minutesTwo] = silentPeriod[1]!.split(':');

    const period1 = getDateByTime(+hoursOne, +minutesOne);
    const period2 = isSameDay
      ? getDateByTime(+hoursTwo, +minutesTwo)
      : getDateByTime(+hoursTwo, +minutesTwo).add(1, 'day');

    const periods = [period1, period2];

    if (date.isAfter(periods[0]) && date.isBefore(periods[1])) {
      // eslint-disable-next-line prefer-destructuring
      date.set('hours', +hoursTwo).set('minute', +minutesTwo).set('second', 0);
    }
  }

  return date.format(DATE_FORMAT);
};
