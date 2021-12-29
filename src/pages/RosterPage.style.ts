import { styled } from '@mui/system';

export const RosterPageContainer = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
}));

export const RosterPageHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});
