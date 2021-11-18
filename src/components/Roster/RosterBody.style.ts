import { styled } from '@mui/system';

export const RosterBodyRow = styled('div')({
  display: 'flex',
});

export const RosterBodyCell = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  minWidth: theme.spacing(5),
  minHeight: theme.spacing(5),
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  borderLeft: `1px solid ${theme.palette.grey[200]}`,
  '&:last-child': {
    borderRight: `1px solid ${theme.palette.grey[200]}`,
  },
}));
