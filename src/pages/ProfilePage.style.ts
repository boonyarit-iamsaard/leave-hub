import { styled } from '@mui/system';

export const ProfilePageSummaryContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto 16px',
  maxWidth: theme.breakpoints.values.md,
  width: '100%',
}));
