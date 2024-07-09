import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import './i18n.config.client';

import './styles/reset.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/App.css';
import { I18nextProvider } from 'react-i18next';
import calendar from 'dayjs/plugin/calendar';
import weekday from 'dayjs/plugin/weekday';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import en from 'dayjs/locale/en';
import { darkTheme, lightTheme } from 'renderer/styles/theme';
import { NotificationEditor, NotificationsList, Settings } from 'renderer/pages';
import { parseUrlParams } from 'renderer/utils';
import { commonStore } from 'renderer/stores';

dayjs.locale({
  ...en,
  weekStart: 1,
});

dayjs.extend(calendar);
dayjs.extend(weekday);

export const App = observer(() => {
  const getRoute = () => {
    const { route } = parseUrlParams(window.location.search);

    switch (route) {
      case 'settings':
        return <Settings />;
      case 'notificationEditor':
        return <NotificationEditor />;
      default:
        return <NotificationsList />;
    }
  };

  useEffect(() => {
    const { route } = parseUrlParams(window.location.search);

    window.electron.ipcRenderer.sendMessage('page-inited', route ?? 'main');
  }, []);

  if (!commonStore.settings) return null;

  return (
    <I18nextProvider i18n={i18next}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={commonStore.settings.theme === 'light' ? lightTheme : darkTheme}>
          <Router>
            <Routes>
              <Route path="/" element={getRoute()} />
            </Routes>
          </Router>
        </ThemeProvider>
      </LocalizationProvider>
    </I18nextProvider>
  );
});
