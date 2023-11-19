import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6369D1',
    },
    background: {
      default: '#fff',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6369D1',
    },
    background: {
      default: '#333',
    },
    text: {
      primary: '#fff',
    },
  },
  typography: {
    allVariants: {
      color: '#fff',
    },
  },
});
