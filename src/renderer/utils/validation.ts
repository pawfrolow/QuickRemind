import { FormikErrors, FormikTouched, getIn } from 'formik';

type TGetFormItemProps = {
  helperText: string;
  error: boolean;
};

export const getFormItemProps = <T>(
  touched: FormikTouched<T>,
  errors: FormikErrors<T>,
  fieldPath: string,
): TGetFormItemProps => {
  const helperText = getIn(touched, fieldPath) && getIn(errors, fieldPath);
  return {
    helperText,
    error: !!helperText,
  };
};
