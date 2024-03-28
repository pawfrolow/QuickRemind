import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RepeatIcon from '@mui/icons-material/Repeat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { FC } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { TNotification } from 'renderer/types';

type TNotificationProps = {
  notification: TNotification;
  index: number;
};

export const Notification: FC<TNotificationProps> = ({
  notification,
  index,
}) => {
  const { t } = useTranslation();
  return (
    <Card
      sx={{ width: '100%', display: 'flex' }}
      style={{ marginBottom: 8, position: 'relative' }}
    >
      <CardContent style={{ flex: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {notification.repeat ? (
            <RepeatIcon color="primary" style={{ marginRight: 16 }} />
          ) : (
            <NotificationsIcon
              style={{ marginRight: 16, marginBottom: 4 }}
              fontSize="small"
            />
          )}
          {notification.title}
          <Typography
            variant="body2"
            component="span"
            style={{ marginLeft: 'auto' }}
          >
            {dayjs(notification.date, 'DD.MM.YYYY HH:mm:ss').calendar(null, {
              sameDay: `[${t('main.calendar.today')}] HH:mm`,
              nextDay: `[${t('main.calendar.tomorrow')}] HH:mm`,
              nextWeek: 'DD.MM.YYYY HH:mm',
              lastDay: 'DD.MM.YYYY HH:mm',
              lastWeek: 'DD.MM.YYYY HH:mm',
              sameElse: 'DD.MM.YYYY HH:mm',
            })}
          </Typography>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {notification.description}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton
          aria-label="edit"
          onClick={() =>
            window.electron.ipcRenderer.sendMessage(
              'open-page',
              'notificationEditor',
              JSON.stringify({
                ...notification,
                index,
              }),
            )
          }
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="edit"
          onClick={() =>
            window.electron.ipcRenderer.sendMessage(
              'notification-delete',
              index,
            )
          }
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
