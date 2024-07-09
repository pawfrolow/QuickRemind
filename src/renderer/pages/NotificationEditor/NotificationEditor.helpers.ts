import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Shape, TNotification } from 'renderer/types';
import { TNotificationEditorForm } from './NotificationEditor.types';

export const prepareNotificationFromForm = ({
  title,
  description,
  repeat,
  repeatNumber,
  repeatPeriod,
  date,
}: TNotificationEditorForm): TNotification => {
  return {
    title,
    description,
    repeat: repeat
      ? {
          number: repeatNumber ?? '1',
          period: repeatPeriod,
        }
      : null,
    date: date.format('DD.MM.YYYY HH:mm:00'),
  };
};

export const useValidation = () => {
  const { t } = useTranslation();

  const requiredText = t('validation.required');

  const repeatNumberValidation = yup.string().when('repeat', {
    is: true,
    then: (schema) => schema.required(requiredText),
  });

  return yup.object().shape<Shape<TNotificationEditorForm>>({
    title: yup.string().required(requiredText),
    description: yup.string().required(requiredText),
    repeatNumber: repeatNumberValidation,
  });
};
