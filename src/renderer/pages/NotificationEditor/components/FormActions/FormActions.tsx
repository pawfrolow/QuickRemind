import { Button, CircularProgress, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { TNotificationEditorForm } from '../../NotificationEditor.types';
import { STEPS_COUNT } from '../../NotificationEditor.constants';
import * as s from './FormActions.styled';

export const FormActions = () => {
  const { t } = useTranslation();
  const {
    values: { step, title, description, repeatNumber, repeat },
    setFieldValue,
    isSubmitting,
  } = useFormikContext<TNotificationEditorForm>();

  const isFinalStep = STEPS_COUNT === step;

  const getConfirmDisabled = () => {
    if (!title || !description) return true;

    if (repeat) {
      if (!repeatNumber || repeatNumber === '0') return true;
    }

    return false;
  };

  return (
    <s.ButtonsWrapper container justifyContent="end">
      <Grid item style={{ marginRight: 'auto' }}>
        <Button onClick={() => window.close()} disabled={isSubmitting}>
          {t('renderer.common.cancel')}
        </Button>
      </Grid>
      {step > 1 && (
        <Grid item style={{ marginRight: 16 }}>
          <Button onClick={() => setFieldValue('step', step - 1)} disabled={isSubmitting}>
            {t('renderer.common.back')}
          </Button>
        </Grid>
      )}
      <Grid item>
        {isFinalStep ? (
          <Button key="submit" type="submit" variant="contained" disabled={getConfirmDisabled()}>
            {isSubmitting ? <CircularProgress /> : t('renderer.common.confirm')}
          </Button>
        ) : (
          <Button
            key="step"
            onClick={() => {
              setFieldValue('step', step + 1);
            }}
            variant="contained"
            disabled={isSubmitting}
          >
            {t('renderer.common.next')}
          </Button>
        )}
      </Grid>
    </s.ButtonsWrapper>
  );
};
