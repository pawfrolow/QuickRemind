import dayjs from 'dayjs';
import { TNotification } from 'renderer/types';

export const DATE_FORMAT = 'DD.MM.YYYY HH:mm:ss';

export const getDateByTime = (hours: number, minutes: number) => {
  return dayjs().set('hour', +hours).set('minute', +minutes).set('second', 0);
};

export const calculateNextDate = (notification: TNotification): string => {
  let date = dayjs(notification.date, DATE_FORMAT);

  if (
    !notification.repeat ||
    !notification.repeat.number ||
    +notification.repeat.number === 0 ||
    Number.isNaN(+notification.repeat.number)
  )
    return notification.date;

  while (date.isBefore(dayjs())) {
    // Догоняем до настоящего времени
    date = date.add(+notification.repeat!.number, notification.repeat!.period);
  }

  return date.format(DATE_FORMAT);
};
