import { TextField } from 'renderer/components';
import { useTranslation } from 'react-i18next';
import { Field, useFormikContext } from 'formik';
import { getFormItemProps } from 'renderer/utils';
import { CustomTabPanel } from '../CustomTabPanel/CustomTabPanel';
import { TNotificationEditorForm } from '../../NotificationEditor.types';

export const MainInfo = () => {
  const { t } = useTranslation();
  const {
    values: { step },
    errors,
    touched,
  } = useFormikContext<TNotificationEditorForm>();

  return (
    <CustomTabPanel value={step} index={1}>
      <Field
        as={TextField}
        label={t('renderer.pages.NotificationEditor.form.title')}
        variant="standard"
        name="title"
        required
        {...getFormItemProps(touched, errors, 'title')}
      />
      <Field
        as={TextField}
        label={t('renderer.pages.NotificationEditor.form.description')}
        variant="standard"
        multiline
        rows={4}
        name="description"
        required
        {...getFormItemProps(touched, errors, 'description')}
      />
    </CustomTabPanel>
  );
};
