import AddIcon from '@mui/icons-material/Add';
import { Box, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { TNotification } from 'renderer/types';
import { Header, Page } from 'renderer/components';
import * as s from './NotificationsList.styled';
import { NotificationsContent } from './components';

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
        <NotificationsContent notifications={notifications} />
      </Box>
      <s.Fab color="primary" aria-label="add" onClick={openCreate}>
        <AddIcon />
      </s.Fab>
    </Page>
  );
}
