import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#006564',
    },
    secondary: {
      main: '#C1B49A',
    },
    error: {
      main: '#A51E36',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    button: {
      textTransform: 'capitalize',
    },
  },
});
