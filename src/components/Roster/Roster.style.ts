import { styled } from '@mui/system';

import { blueGrey, teal } from '@mui/material/colors';

export const RosterRow = styled('div')({
  display: 'flex',
});

export const RosterCell = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  minWidth: theme.spacing(5),
  minHeight: theme.spacing(5),
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  borderLeft: `1px solid ${theme.palette.grey[300]}`,
  '&:last-child': {
    borderRight: `1px solid ${theme.palette.grey[300]}`,
  },
}));

export const RosterHeaderFirstColumn = styled('div')(({ theme }) => ({
  alignItems: 'center',
  background: blueGrey[100],
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  borderLeft: `1px solid ${theme.palette.grey[300]}`,
  display: 'flex',
  fontSize: 14,
  height: theme.spacing(5),
  left: 0,
  minWidth: 100,
  paddingLeft: theme.spacing(1),
  position: 'sticky',
  top: 0,
  zIndex: 3,
}));

export const RosterHeaderColumn = styled('div')(({ theme }) => ({
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  minWidth: theme.spacing(5),
  minHeight: theme.spacing(5),
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  borderLeft: `1px solid ${theme.palette.grey[300]}`,
  '&:last-child': {
    borderRight: `1px solid ${theme.palette.grey[300]}`,
  },
}));

export const RosterBodyFirstColumn = styled('div')(({ theme }) => ({
  alignItems: 'center',
  background: teal[50],
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  borderLeft: `1px solid ${theme.palette.grey[300]}`,
  display: 'flex',
  fontSize: 14,
  height: theme.spacing(5),
  left: 0,
  minWidth: 100,
  paddingLeft: theme.spacing(1),
  position: 'sticky',
  zIndex: 0,
}));
