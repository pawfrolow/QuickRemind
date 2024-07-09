import * as fs from 'fs';
import { Notification, ipcMain } from 'electron';
import dayjs from 'dayjs';
import { TNotification, TNullable } from 'main/types';
import { windows } from 'main/windows';
import { DATE_FORMAT, calculateNextDate, getAssetPath, removeElem } from 'main/utils';
import { tray } from 'main/tray';

const NOTIFICATIONS_PATH = `${getAssetPath()}/data/notifications.json`;

class NotificationsController {
  notifications: TNotification[] = [];

  watchId: TNullable<ReturnType<typeof setInterval>> = null;

  constructor() {
    this.readNotifications();

    ipcMain.on('notification-create', async (event, notification) => {
      this.notifications.push(notification);
      this.writeNotifications(this.notifications, () => {
        event.reply('notification-create');
        this.notificationsUpdated();
      });
    });

    ipcMain.on('notification-edit', async (event, notification, index) => {
      this.notifications[index] = notification;
      this.notifications[index].date = calculateNextDate(notification);
      this.writeNotifications(this.notifications, () => {
        event.reply('notification-edit');
        this.notificationsUpdated();
      });
    });

    ipcMain.on('notification-get', async (event) => {
      event.reply('notification-get', this.notifications);
    });

    ipcMain.on('notification-delete', (_, index: number) => {
      this.removeNotification(index);
      this.notificationsUpdated();
    });
  }

  notificationsUpdated = () => {
    windows.main?.emitter?.reply('notification-get', this.notifications);
    tray.main?.rebuildMenu();
  };

  watchNotifications = () => {
    this.watchId = setInterval(() => {
      if (this.notifications.length > 0) {
        const index = this.notifications.findIndex((elem) => dayjs(elem.date, DATE_FORMAT).isBefore(dayjs()));
        if (index > -1) {
          this.sendNotification(index);

          if (this.notifications[index].repeat) {
            const notification = { ...this.notifications[index] };

            notification.date = calculateNextDate(notification);

            this.notifications.push(notification);
          }

          this.removeNotification(index);
        }
      }
    }, 1000);
  };

  sendNotification = (index: number) => {
    new Notification({
      title: this.notifications[index].title,
      body: this.notifications[index].description,
    }).show();
  };

  removeNotification = (index: number) => {
    this.notifications = removeElem(index, this.notifications);
    this.writeNotifications(this.notifications, this.notificationsUpdated);
  };

  readNotifications = () => {
    fs.readFile(NOTIFICATIONS_PATH, 'utf8', (error, data) => {
      if (error) throw error;

      this.notifications = JSON.parse(data);
      this.notificationsUpdated();
      this.watchNotifications();
    });
  };

  writeNotifications = (data: any, callback: () => void) => {
    this.notifications = data.sort((a: TNotification, b: TNotification) =>
      dayjs(a.date, DATE_FORMAT).isAfter(dayjs(b.date, DATE_FORMAT)) ? 1 : -1,
    );
    fs.writeFile(NOTIFICATIONS_PATH, JSON.stringify(data), (error) => {
      if (error) throw error;

      callback();
    });
  };
}

export default new NotificationsController();
