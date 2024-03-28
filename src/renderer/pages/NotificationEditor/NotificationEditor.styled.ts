import { Chip, Grid, TextField, ToggleButton } from '@mui/material';
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

export const TextFieldStyle = styled(TextField)`
  margin-bottom: 16px;
  width: 100%;
`;

export const ButtonsWrapper = styled(Grid)`
  margin-top: auto;
  width: 100%;
`;

export const ToggleButtonStyle = styled(ToggleButton)`
  padding: 4px 8px;
  height: 36px;
`;

export const Weekday = styled(Chip)`
  height: 45px;
  width: 45px;
  border-radius: 100%;
`;
