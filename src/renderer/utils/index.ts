import dayjs from 'dayjs';
import { TNotification } from 'renderer/types';

export const parseUrlParams = (url: string): Record<string, string> => {
  // Извлекаем строку запроса из URL
  const queryString = url.split('?')[1];

  // Если нет строки запроса, возвращаем пустой объект
  if (!queryString) {
    return {};
  }

  // Разбиваем строку запроса на массив параметров
  const paramsArray = queryString.split('&');

  // Инициализируем объект для хранения параметров
  const paramsObject: Record<string, string> = {};

  // Итерируем по массиву параметров
  paramsArray.forEach((param) => {
    // Разбиваем каждый параметр на имя и значение
    const [key, value] = param.split('=');

    // Декодируем значения и добавляем их в объект
    paramsObject[key] = decodeURIComponent(value);
  });

  return paramsObject;
};

export const DATE_FORMAT = 'DD.MM.YYYY HH:mm:ss';

export const getDateByTime = (hours: number, minutes: number) => {
  return dayjs().set('hour', +hours).set('minute', +minutes).set('second', 0);
};

export const calculateNextDate = (notification: TNotification): string => {
  let date = dayjs(notification.date, DATE_FORMAT);

  if (!notification.repeat) return notification.date;

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

export const generateId = (mask = 'xxxxxxxxxx', map = '0123456789abcdef') => {
  const { length } = map;
  return mask.replace(/x/g, () => map[Math.floor(Math.random() * length)]);
};
