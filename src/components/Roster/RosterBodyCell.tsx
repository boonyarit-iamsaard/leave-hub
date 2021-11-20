import { FC } from 'react';
import { isSameDay } from 'date-fns';

import { grey, indigo, yellow } from '@mui/material/colors';

import {
  Roster,
  ShiftPriority,
  ShiftStatus,
} from '../../interfaces/roster.interface';

import { RosterCell } from './Roster.style';
import { Badge, useTheme } from '@mui/material';

interface RosterBodyCellProps {
  roster: Roster[];
  date: Date;
  uid: string;
  handleEditDialogOpen: (shift: Roster) => void;
}

const RosterBodyCell: FC<RosterBodyCellProps> = ({
  roster,
  uid,
  date,
  handleEditDialogOpen,
}) => {
  const theme = useTheme();
  const shift = roster.find(
    shift => isSameDay(shift.date, date) && shift.uid === uid
  );

  const shiftColor: { [key: string]: string } = {
    ANL1: theme.palette.secondary.main,
    ANL2: theme.palette.info.main,
    ANL3: theme.palette.primary.main,
    ANL: yellow[300],
    H: indigo[300],
    TYC: theme.palette.error.main,
    X: grey[400],
  };

  const handlerClickCell = () => {
    if (shift) {
      handleEditDialogOpen(shift);
    }
  };

  return shift?.status === ShiftStatus.Pending ? (
    <Badge color="warning" badgeContent="!">
      <RosterCell
        onClick={handlerClickCell}
        style={{
          cursor: shift ? 'pointer' : 'default',
          backgroundColor: shift ? shiftColor[shift.priority] : '#fff',
          color:
            shift?.priority === ShiftPriority.TYC ||
            shift?.priority === ShiftPriority.ANL3
              ? '#fff'
              : theme.palette.text.primary,
        }}
      >
        {shift ? shift.type : ''}
      </RosterCell>
    </Badge>
  ) : (
    <RosterCell
      onClick={handlerClickCell}
      style={{
        cursor: shift ? 'pointer' : 'default',
        backgroundColor: shift ? shiftColor[shift.priority] : '#fff',
        color:
          shift?.priority === ShiftPriority.TYC ||
          shift?.priority === ShiftPriority.ANL3
            ? '#fff'
            : theme.palette.text.primary,
      }}
    >
      {shift ? shift.type : ''}
    </RosterCell>
  );
};

export default RosterBodyCell;
