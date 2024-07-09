import { Menu, MenuItemConstructorOptions, app } from 'electron';
import i18next from 'i18next';
import dayjs from 'dayjs';
import { config } from 'main/config';
import { openWindow } from 'main/windows';
import { notificationsController } from 'main/controllers';
import { DATE_FORMAT } from 'main/utils';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

const isMacOs = process.platform === 'darwin';
const MAX_NOTIFICATIONS = 10;

export const getAboutSettingsMenu = (): MenuItemConstructorOptions[] => [
  {
    label: config.appName,
    enabled: false,
  },
  { type: 'separator' },
  {
    label: i18next.t('main.menu.main.settings'),
    click: () => openWindow('settings'),
  },
  { type: 'separator' },
];

export const getQuitMenu = (): DarwinMenuItemConstructorOptions[] =>
  isMacOs
    ? [
        { type: 'separator' },
        {
          label: i18next.t('main.menu.main.quit'),
          click: () => app.quit(),
        },
      ]
    : [];

export const getPlannedMenu = (): MenuItemConstructorOptions[] => {
  const items: MenuItemConstructorOptions[] = notificationsController.notifications
    .filter((_, index) => index < MAX_NOTIFICATIONS)
    .map((item, index) => ({
      label: `${item.repeat ? '🔁' : ''} ${item.title} (${dayjs(item.date, DATE_FORMAT).calendar(null, {
        sameDay: `[${i18next.t('main.calendar.today')}] HH:mm`,
        nextDay: `[${i18next.t('main.calendar.tomorrow')}] HH:mm`,
        nextWeek: 'DD.MM.YYYY HH:mm',
        lastDay: 'DD.MM.YYYY HH:mm',
        lastWeek: 'DD.MM.YYYY HH:mm',
        sameElse: 'DD.MM.YYYY HH:mm',
      })})`,
      sublabel: item.description,
      submenu: [
        {
          label: `✎ ${i18next.t('main.menu.edit.edit')}`,
          click: () => openWindow('notificationEditor', JSON.stringify({ ...item, index })),
        },
        {
          label: `✗ ${i18next.t('main.menu.edit.delete')}`,
          click: () => notificationsController.removeNotification(index),
        },
      ],
    }));

  if (items.length === 0) {
    items.push({
      label: i18next.t('renderer.pages.NotificationsList.empty'),
      enabled: false,
    });
  }

  if (notificationsController.notifications.length > MAX_NOTIFICATIONS) {
    const rest = notificationsController.notifications.length - MAX_NOTIFICATIONS;
    items.push({
      label: `${i18next.t('main.tray.more')} ${rest}...`,
      enabled: false,
    });
  }

  return [
    {
      label: i18next.t('renderer.pages.NotificationsList.title'),
      enabled: false,
    },
    ...items,
  ];
};

export const getAddMenu = (): MenuItemConstructorOptions[] => [
  { type: 'separator' },
  {
    label: `+ ${i18next.t('main.menu.edit.create')}`,
    click: () => openWindow('notificationEditor'),
  },
];
