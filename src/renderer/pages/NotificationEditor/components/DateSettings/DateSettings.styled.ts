import { styled } from '@mui/material/styles';
import { StaticDatePicker } from '@mui/x-date-pickers';

export const DatePicker = styled(StaticDatePicker)`
  .MuiDialogActions-root {
    display: none;
  }
  .MuiPickersToolbar-root {
    display: none;
  }
`;
