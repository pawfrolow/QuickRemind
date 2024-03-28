import { useTranslation } from 'react-i18next';
import TranslateIcon from '@mui/icons-material/Translate';
import {
  Button,
  Grid,
  List,
  ListItemIcon,
  ListItemText,
  ToggleButtonGroup,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { toJS } from 'mobx';
import { commonStore } from 'renderer/stores';
import { Page, ThemeToggle } from 'renderer/components';
import * as s from './Settings.styled';

export const Settings = observer(() => {
  const { t } = useTranslation();
  const prevSettings = useRef(toJS(commonStore.settings));

  const handleLanguageChange = (_: any, value: string) => {
    if (value) {
      window.electron.ipcRenderer.sendMessage('language-changed', value);
      window.electron.ipcRenderer.sendMessage('settings-save', {
        ...toJS(commonStore.settings),
        language: value,
      });
    }
  };
  const cancel = () => {
    window.electron.ipcRenderer.sendMessage(
      'settings-save',
      prevSettings.current,
    );
    window.close();
  };

  return (
    <Page>
      <List disablePadding>
        <s.ListItemStyle>
          <ListItemText primary={t('renderer.pages.Settings.darkMode')} />
          <ThemeToggle />
        </s.ListItemStyle>
        <s.ListItemStyle>
          <ListItemIcon>
            <TranslateIcon />
          </ListItemIcon>
          <ListItemText primary={t('renderer.pages.Settings.language')} />
          <ToggleButtonGroup
            value={commonStore.settings?.language}
            exclusive
            onChange={handleLanguageChange}
            aria-label="text alignment"
          >
            <s.ToggleButtonStyle value="ru" aria-label="Russian">
              RU
            </s.ToggleButtonStyle>
            <s.ToggleButtonStyle value="en" aria-label="English">
              EN
            </s.ToggleButtonStyle>
          </ToggleButtonGroup>
        </s.ListItemStyle>
      </List>
      <Grid container spacing={2} style={{ marginTop: 'auto' }}>
        <Grid item style={{ marginLeft: 'auto' }}>
          <Button onClick={cancel}>{t('renderer.common.cancel')}</Button>
        </Grid>
        <Grid item>
          <Button onClick={() => window.close()} variant="contained">
            {t('renderer.common.confirm')}
          </Button>
        </Grid>
      </Grid>
    </Page>
  );
});
