import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { DATE_FORMAT, calculateNextDate } from 'renderer/utils';
import dayjs from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers';
import { CustomTabPanel } from '../CustomTabPanel/CustomTabPanel';
import { TNotificationEditorForm, TTimePreset } from '../../NotificationEditor.types';
import { timePresets } from '../../NotificationEditor.constants';
import { prepareNotificationFromForm } from '../../NotificationEditor.helpers';
import * as s from './DateSettings.styled';

export const DateSettings = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<TNotificationEditorForm>();

  const { step, date } = values;

  const notification = calculateNextDate({
    ...prepareNotificationFromForm(values),
    date: dayjs().format('DD.MM.YYYY HH:mm:00'),
  });

  const datePickerMinDate = dayjs(notification, DATE_FORMAT);

  const handlePreset = (preset: TTimePreset) => {
    setFieldValue('date', dayjs().add(preset.number, preset.unit));
  };

  return (
    <CustomTabPanel value={step} index={3}>
      <Grid container style={{ width: '100%' }}>
        <Grid item xs={8}>
          <s.DatePicker
            disablePast
            value={date}
            onChange={(value) => value && setFieldValue('date', value)}
            minDate={datePickerMinDate}
          />
        </Grid>
        <Grid item xs={4} style={{ paddingLeft: 16 }}>
          <TimePicker
            label={t('renderer.pages.NotificationEditor.form.time')}
            value={date}
            minTime={dayjs()}
            onChange={(value) => value && setFieldValue('date', value)}
            ampm={false}
          />
          <List>
            {timePresets.map((preset) => {
              return (
                <ListItem disablePadding key={`preset-${preset.title}`} onClick={() => handlePreset(preset)}>
                  <ListItemButton>
                    <ListItemText primary={t(`renderer.pages.NotificationEditor.form.${preset.title}`)} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Grid>
    </CustomTabPanel>
  );
};
