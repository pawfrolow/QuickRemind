import AddIcon from '@mui/icons-material/Add';

import { Box, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import * as s from './NotificationsList.styled';
import { Header, Notification, Page } from '../../components';
import { TNotification } from '../../types';

export function NotificationsList() {
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('notification-get');
    window.electron.ipcRenderer.on('notification-get', (data: any) => {
      setNotifications(data);
    });
  }, []);

  const openSettings = () => {
    window.electron.ipcRenderer.sendMessage('open-page', 'settings');
  };

  const openCreate = () => {
    window.electron.ipcRenderer.sendMessage('open-page', 'notificationEditor');
  };

  return (
    <Page>
      <Header
        title={t('renderer.pages.NotificationsList.title')}
        rightPanel={
          <IconButton aria-label="settings" onClick={openSettings}>
            <SettingsIcon />
          </IconButton>
        }
      />
      <Box style={{ paddingBottom: 100, overflowY: 'auto' }}>
        {notifications.length > 0 ? (
          notifications.map((n, i) => {
            return (
              <Notification
                key={`${n.date}-${n.title}`}
                notification={n}
                index={i}
              />
            );
          })
        ) : (
          <s.Empty>Список пуст, добавьте уведомление</s.Empty>
        )}
      </Box>
      <s.Fab color="primary" aria-label="add" onClick={openCreate}>
        <AddIcon />
      </s.Fab>
    </Page>
  );
}
