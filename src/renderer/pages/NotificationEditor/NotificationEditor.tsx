import {
  Box,
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Switch,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import * as s from './NotificationEditor.styled';
import { Page } from '../../components';
import { repeatPeriods, timePresets } from '../../constants';
import { TNotification, TNullable } from '../../types';
import { TTimePreset } from '../../constants/timePresets';
import { parseUrlParams } from '../../utils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  style?: CSSProperties;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Box>
  );
}

export const NotificationEditor = () => {
  const [sending, setSending] = useState(false);
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repeat, setRepeat] = useState(false);
  const [repeatNumber, setRepeatNumber] = useState('1');
  const [repeatPeriod, setRepeatPeriod] =
    useState<TNotification['repeatPeriod']>('hour');
  const [date, setDate] = useState<Dayjs>(dayjs().add(10, 'minute'));
  const mode = useRef<'create' | 'edit'>('create');
  const index = useRef<TNullable<number>>(null);

  const { t } = useTranslation();

  useEffect(() => {
    const { payload } = parseUrlParams(window.location.search);
    if (payload) {
      const n = JSON.parse(payload) as TNotification & { index: number };
      setTitle(n.title);
      setDescription(n.description);
      setRepeat(n.repeat);
      setRepeatNumber(`${n.repeatNumber}`);
      setRepeatPeriod(n.repeatPeriod);
      setDate(dayjs(n.date, 'DD.MM.YYYY HH:mm:ss'));

      mode.current = 'edit';
      index.current = n.index;
    }
  }, []);

  const handlePreset = (preset: TTimePreset) => {
    setDate(dayjs().add(preset.number, preset.unit));
  };

  const handleConfirm = () => {
    const notification = {
      title,
      description,
      repeat,
      repeatNumber,
      repeatPeriod,
      date: date.format('DD.MM.YYYY HH:mm:00'),
    };

    setSending(true);
    const event:
      | 'notification-edit'
      | 'notification-create' = `notification-${mode.current}`;
    window.electron.ipcRenderer.sendMessage(event, notification, index.current);

    window.electron.ipcRenderer.once(event, () => {
      setSending(false);
      window.close();
    });
  };

  const getConfirmButtonContent = () => {
    if (sending) return <CircularProgress />;

    return t(`renderer.common.${step === 1 ? 'confirm' : 'next'}`);
  };

  const getConfirmDisabled = () => {
    if (step === 1) {
      if (!title || !description) return true;

      if (repeat && (!repeatNumber || repeatNumber === '0')) {
        return true;
      }
    }

    return false;
  };

  return (
    <Page>
      <CustomTabPanel value={step} index={0}>
        <s.TextFieldStyle
          label={t('renderer.pages.NotificationEditor.form.title')}
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <s.TextFieldStyle
          label={t('renderer.pages.NotificationEditor.form.description')}
          variant="standard"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <List disablePadding>
          <ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
            <ListItemText
              primary={t('renderer.pages.NotificationEditor.form.repeat')}
            />
            <Switch
              checked={repeat}
              onChange={(e) => setRepeat(e.target.checked)}
            />
          </ListItem>
          {repeat && (
            <ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
              <ListItemText
                primary={t('renderer.pages.NotificationEditor.form.every')}
              />
              <Grid container style={{ width: '50%' }}>
                <Grid item xs={6} style={{ paddingRight: 16 }}>
                  <s.TextFieldStyle
                    label={t('renderer.pages.NotificationEditor.form.number')}
                    variant="standard"
                    value={repeatNumber}
                    onChange={(e) =>
                      setRepeatNumber(e.target.value.replace(/\D/g, ''))
                    }
                    style={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <s.TextFieldStyle
                    label={t('renderer.pages.NotificationEditor.form.period')}
                    variant="standard"
                    select
                    style={{ width: '100%' }}
                    value={repeatPeriod}
                    onChange={(e) =>
                      setRepeatPeriod(
                        e.target.value as TNotification['repeatPeriod'],
                      )
                    }
                  >
                    {repeatPeriods.map((period) => {
                      return (
                        <MenuItem key={period.value} value={period.value}>
                          {period.title}
                        </MenuItem>
                      );
                    })}
                  </s.TextFieldStyle>
                </Grid>
              </Grid>
            </ListItem>
          )}
        </List>
      </CustomTabPanel>
      <CustomTabPanel value={step} index={1}>
        <Grid container style={{ width: '100%' }}>
          <Grid item xs={8}>
            <s.DatePicker
              disablePast
              value={date}
              onChange={(value) => value && setDate(value as Dayjs)}
            />
          </Grid>
          <Grid item xs={4} style={{ paddingLeft: 16 }}>
            <TimePicker
              label={t('renderer.pages.NotificationEditor.form.time')}
              value={date}
              minTime={dayjs()}
              onChange={(value) => value && setDate(value)}
              ampm={false}
            />
            <List>
              {timePresets.map((preset) => {
                return (
                  <ListItem
                    disablePadding
                    key={`preset-${preset.title}`}
                    onClick={() => handlePreset(preset)}
                  >
                    <ListItemButton>
                      <ListItemText
                        primary={t(
                          `renderer.pages.NotificationEditor.form.${preset.title}`,
                        )}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        </Grid>
      </CustomTabPanel>
      <s.ButtonsWrapper container justifyContent="end">
        <Grid item style={{ marginRight: 'auto' }}>
          <Button onClick={() => window.close()} disabled={sending}>
            {t('renderer.common.cancel')}
          </Button>
        </Grid>
        {step > 0 && (
          <Grid item style={{ marginRight: 16 }}>
            <Button onClick={() => setStep(step - 1)} disabled={sending}>
              {t('renderer.common.back')}
            </Button>
          </Grid>
        )}
        <Grid item>
          <Button
            onClick={() => (step === 1 ? handleConfirm() : setStep(step + 1))}
            variant="contained"
            disabled={getConfirmDisabled()}
          >
            {getConfirmButtonContent()}
          </Button>
        </Grid>
      </s.ButtonsWrapper>
    </Page>
  );
};
