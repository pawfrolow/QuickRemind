import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Notification } from 'renderer/components';
import { TNotification } from 'renderer/types';
import * as s from './NotificationsContent.styled';

interface INotificationsContentProps {
  notifications: TNotification[];
}

export const NotificationsContent: FC<INotificationsContentProps> = ({ notifications }) => {
  const { t } = useTranslation();

  return notifications.length > 0 ? (
    notifications.map((n, i) => {
      return <Notification key={`${n.date}-${n.title}`} notification={n} index={i} />;
    })
  ) : (
    <s.Empty>{t('renderer.pages.NotificationsList.empty')}</s.Empty>
  );
};
