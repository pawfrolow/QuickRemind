import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Formik, FormikHelpers } from 'formik';

import { TNotification, TNullable } from 'renderer/types';
import { parseUrlParams } from 'renderer/utils';
import { Page } from 'renderer/components';
import { FormActions, Steps } from './components';
import { TNotificationEditorForm } from './NotificationEditor.types';
import { prepareNotificationFromForm, useValidation } from './NotificationEditor.helpers';
import { initialFormValues } from './NotificationEditor.constants';

import * as s from './NotificationEditor.styled';

export const NotificationEditor = () => {
  const [notification, setNotification] = useState<TNotificationEditorForm>(initialFormValues);
  const validation = useValidation();
  const mode = useRef<'create' | 'edit'>('create');
  const index = useRef<TNullable<number>>(null);

  useEffect(() => {
    const { payload } = parseUrlParams(window.location.search);
    if (payload) {
      const {
        title,
        description,
        date,
        repeat,
        index: indexN,
      } = JSON.parse(payload) as TNotification & { index: number };
      const { repeatNumber, repeatPeriod } = initialFormValues;

      const editNotification: TNotificationEditorForm = {
        step: 1,
        title,
        description,
        date: dayjs(date, 'DD.MM.YYYY HH:mm:ss'),
        repeat: !!repeat,
        repeatNumber: repeat?.number ?? repeatNumber,
        repeatPeriod: repeat?.period ?? repeatPeriod,
      };

      setNotification(editNotification);

      mode.current = 'edit';
      index.current = indexN;
    }
  }, []);

  const handleConfirm = (values: TNotificationEditorForm, formikHelpers: FormikHelpers<TNotificationEditorForm>) => {
    formikHelpers.setSubmitting(true);
    const event: 'notification-edit' | 'notification-create' = `notification-${mode.current}`;
    const preparedNotification = prepareNotificationFromForm(values);

    window.electron.ipcRenderer.sendMessage(event, preparedNotification, index.current);

    window.electron.ipcRenderer.once(event, () => {
      formikHelpers.setSubmitting(false);
      window.close();
    });
  };

  return (
    <Page>
      <Formik enableReinitialize initialValues={notification} onSubmit={handleConfirm} validationSchema={validation}>
        {({ handleSubmit }) => {
          return (
            <s.FormStyle onSubmit={handleSubmit}>
              <Steps.MainInfo />
              <Steps.RepeatSettings />
              <Steps.DateSettings />
              <FormActions />
            </s.FormStyle>
          );
        }}
      </Formik>
    </Page>
  );
};
