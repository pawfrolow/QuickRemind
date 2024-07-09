import React, { ChangeEvent } from 'react';
import { Grid, List, ListItem, ListItemText, MenuItem, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'renderer/components';
import { TRepeat } from 'renderer/types';
import { getFormItemProps } from 'renderer/utils';
import { CustomTabPanel } from '../CustomTabPanel/CustomTabPanel';
import { TNotificationEditorForm } from '../../NotificationEditor.types';

import { repeatPeriods } from '../../NotificationEditor.constants';

export const RepeatSettings = () => {
  const { t } = useTranslation();
  const {
    values: { step, repeat, repeatNumber, repeatPeriod },
    touched,
    errors,
    setFieldValue,
  } = useFormikContext<TNotificationEditorForm>();

  const onChangeRepeatNumber = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFieldValue('repeatNumber', e.target.value.replace(/\D/g, ''));
  };

  const onChangeRepeatPeriod = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFieldValue('repeatPeriod', e.target.value as TRepeat['period']);
  };

  return (
    <CustomTabPanel value={step} index={2}>
      <List disablePadding>
        <ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
          <ListItemText primary={t('renderer.pages.NotificationEditor.form.repeat')} />
          <Switch checked={repeat} onChange={(e) => setFieldValue('repeat', e.target.checked)} />
        </ListItem>
        {repeat && (
          <ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
            <ListItemText primary={t('renderer.pages.NotificationEditor.form.every')} />
            <Grid container style={{ width: '50%' }}>
              <Grid item xs={6} style={{ paddingRight: 16 }}>
                <Field
                  as={TextField}
                  label={t('renderer.pages.NotificationEditor.form.number')}
                  variant="standard"
                  value={repeatNumber}
                  onChange={onChangeRepeatNumber}
                  required
                  style={{ width: '100%' }}
                  name="repeatNumber"
                  {...getFormItemProps(touched, errors, 'repeatNumber')}
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  as={TextField}
                  label={t('renderer.pages.NotificationEditor.form.period')}
                  variant="standard"
                  select
                  style={{ width: '100%' }}
                  value={repeatPeriod}
                  onChange={onChangeRepeatPeriod}
                >
                  {repeatPeriods.map((period) => {
                    return (
                      <MenuItem key={period} value={period}>
                        {t(`renderer.repeatPeriods.${period}`)}
                      </MenuItem>
                    );
                  })}
                </Field>
              </Grid>
            </Grid>
          </ListItem>
        )}
      </List>
    </CustomTabPanel>
  );
};
