import {
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
import { useEffect, useRef, useState } from 'react';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { TNotification, TNullable, TRepeat } from 'renderer/types';
import { DATE_FORMAT, calculateNextDate, parseUrlParams } from 'renderer/utils';
import {
  TTimePreset,
  repeatPeriods,
  timePresets,
  weekDays,
} from 'renderer/constants';
import { Page } from 'renderer/components';
import { CustomTabPanel } from './components';
import * as s from './NotificationEditor.styled';

export const NotificationEditor = () => {
  const [sending, setSending] = useState(false);
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repeat, setRepeat] = useState(false);
  const [repeatNumber, setRepeatNumber] = useState('1');
  const [repeatPeriod, setRepeatPeriod] = useState<TRepeat['period']>('hour');
  const [isSilentPeriod, setIsSilentPeriod] = useState(false);
  const [silentPeriod, setSilentPeriod] = useState<
    [TNullable<Dayjs>, TNullable<Dayjs>]
  >([null, null]);
  const [days, setDays] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [date, setDate] = useState<Dayjs>(dayjs().add(10, 'minute'));
  const mode = useRef<'create' | 'edit'>('create');
  const index = useRef<TNullable<number>>(null);

  const notification: TNotification = {
    title,
    description,
    repeat: repeat
      ? {
          number: repeatNumber,
          period: repeatPeriod,
          silentPeriod: isSilentPeriod
            ? [
                silentPeriod[0]?.format('HH:mm') ?? null,
                silentPeriod[1]?.format('HH:mm') ?? null,
              ]
            : [null, null],
          days,
        }
      : null,
    date: date.format('DD.MM.YYYY HH:mm:00'),
  };

  const isFinalStep = step === 2;

  const { t } = useTranslation();

  useEffect(() => {
    const { payload } = parseUrlParams(window.location.search);
    if (payload) {
      const n = JSON.parse(payload) as TNotification & { index: number };
      setTitle(n.title);
      setDescription(n.description);
      setDate(dayjs(n.date, 'DD.MM.YYYY HH:mm:ss'));
      setRepeat(!!n.repeat);
      if (n.repeat) {
        setRepeatNumber(n.repeat.number);
        setRepeatPeriod(n.repeat.period);
        setDays(n.repeat.days);
        if (n.repeat.silentPeriod[0] && n.repeat.silentPeriod[1]) {
          setIsSilentPeriod(true);
          const [hoursOne, minutesOne] = n.repeat.silentPeriod[0]!.split(':');
          const [hoursTwo, minutesTwo] = n.repeat.silentPeriod[1]!.split(':');
          setSilentPeriod([
            dayjs()
              .set('hour', +hoursOne)
              .set('minute', +minutesOne)
              .set('second', 0),
            dayjs()
              .set('hour', +hoursTwo)
              .set('minute', +minutesTwo)
              .set('second', 0),
          ]);
        }
      }

      mode.current = 'edit';
      index.current = n.index;
    }
  }, []);

  const handlePreset = (preset: TTimePreset) => {
    setDate(dayjs().add(preset.number, preset.unit));
  };

  const handleConfirm = () => {
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

    return t(`renderer.common.${isFinalStep ? 'confirm' : 'next'}`);
  };

  const getConfirmDisabled = () => {
    if (isFinalStep) {
      if (!title || !description) return true;

      if (repeat) {
        if (!repeatNumber || repeatNumber === '0') return true;
        if (days.length === 0) return true;
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
      </CustomTabPanel>
      <CustomTabPanel value={step} index={1}>
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
                    onChange={(e) => {
                      setRepeatNumber(e.target.value.replace(/\D/g, '') || '0');
                    }}
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
                    onChange={(e) => {
                      setRepeatPeriod(e.target.value as TRepeat['period']);
                    }}
                  >
                    {repeatPeriods.map((period) => {
                      return (
                        <MenuItem key={period} value={period}>
                          {t(`renderer.repeatPeriods.${period}`)}
                        </MenuItem>
                      );
                    })}
                  </s.TextFieldStyle>
                </Grid>
              </Grid>
            </ListItem>
          )}
          {repeat && (
            <ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
              <ListItemText
                primary={t(
                  'renderer.pages.NotificationEditor.form.silencePeriod',
                )}
              />
              <Switch
                checked={isSilentPeriod}
                onChange={(e) => setIsSilentPeriod(e.target.checked)}
              />
            </ListItem>
          )}
          {repeat && isSilentPeriod && (
            <ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
              <ListItemText
                primary={t(
                  'renderer.pages.NotificationEditor.form.silencePeriod',
                )}
              />
              <Grid container style={{ width: '50%' }}>
                <Grid item xs={6} style={{ paddingRight: 8 }}>
                  <TimePicker
                    label={t('renderer.pages.NotificationEditor.form.from')}
                    value={silentPeriod[0]}
                    onChange={(value) =>
                      setSilentPeriod([value ?? dayjs(), silentPeriod[1]])
                    }
                    ampm={false}
                  />
                </Grid>
                <Grid item xs={6} style={{ paddingLeft: 8 }}>
                  <TimePicker
                    label={t('renderer.pages.NotificationEditor.form.to')}
                    value={silentPeriod[1]}
                    onChange={(value) =>
                      setSilentPeriod([silentPeriod[0], value ?? dayjs()])
                    }
                    ampm={false}
                  />
                </Grid>
              </Grid>
            </ListItem>
          )}
          {repeat && (
            <Grid
              container
              justifyContent="center"
              style={{ marginBottom: 16, marginTop: 16 }}
            >
              {Object.entries(weekDays).map(([key, value]) => (
                <Grid key={`week-day-${key}`} item style={{ marginRight: 16 }}>
                  <s.Weekday
                    variant={days.includes(+key) ? 'filled' : 'outlined'}
                    color="primary"
                    label={t(`common.week.short.${value}`)}
                    onClick={() =>
                      setDays(
                        days.includes(+key)
                          ? days.filter((day) => day !== +key)
                          : [...new Set([...days, +key].sort((a, b) => a - b))],
                      )
                    }
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </List>
      </CustomTabPanel>
      <CustomTabPanel value={step} index={2}>
        <Grid container style={{ width: '100%' }}>
          <Grid item xs={8}>
            <s.DatePicker
              disablePast
              value={date}
              onChange={(value) => value && setDate(value as Dayjs)}
              minDate={dayjs(
                calculateNextDate({
                  ...notification,
                  date: dayjs().format('DD.MM.YYYY HH:mm:00'),
                }),
                DATE_FORMAT,
              )}
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
            onClick={() => (isFinalStep ? handleConfirm() : setStep(step + 1))}
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
