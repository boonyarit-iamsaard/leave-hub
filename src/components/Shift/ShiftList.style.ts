import { styled } from '@mui/system';

export const ShiftListContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  maxWidth: theme.breakpoints.values.md,
  width: '100%',
  margin: '0 auto',
}));
