import { FC } from 'react';
import { isSameDay } from 'date-fns';

import { amber, grey, indigo, purple, yellow } from '@mui/material/colors';

import {
  Roster,
  ShiftPriority,
  ShiftStatus,
  ShiftType,
} from '../../interfaces/roster.interface';

import { RosterCell } from './Roster.style';
import { Badge, Tooltip, useTheme } from '@mui/material';

import useProfile from '../../hooks/useProfile';

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
  const { profile } = useProfile();
  const shift = roster.find(
    shift => isSameDay(shift.date, date) && shift.uid === uid
  );

  const shiftColor: { [key: string]: string } = {
    ANL1: theme.palette.secondary.main,
    ANL2: theme.palette.info.main,
    ANL3: theme.palette.primary.main,
    ANL: yellow[300],
    Carryover: purple[400],
    H: indigo[300],
    TYC: theme.palette.error.main,
    Vaccination: amber[500],
    Other: amber[500],
    X: grey[400],
  };

  const shiftLabel = (): ShiftType | string => {
    if (!shift) return '';

    return shift && shift.priority !== ShiftPriority.Vaccination
      ? shift.type
      : 'VCL';
  };

  const handlerClickCell = () => {
    if (shift) {
      handleEditDialogOpen(shift);
    }
  };

  return shift?.status === ShiftStatus.Pending ? (
    <Tooltip arrow title={shift.priority}>
      <Badge color="warning" badgeContent="!">
        <RosterCell
          onClick={profile.isAdmin ? handlerClickCell : undefined}
          style={{
            cursor: shift && profile.isAdmin ? 'pointer' : 'default',
            backgroundColor: shift ? shiftColor[shift.priority] : '#fff',
            color:
              shift?.priority === ShiftPriority.TYC ||
              shift?.priority === ShiftPriority.ANL3
                ? '#fff'
                : theme.palette.text.primary,
          }}
        >
          {shiftLabel()}
        </RosterCell>
      </Badge>
    </Tooltip>
  ) : (
    <RosterCell
      onClick={profile.isAdmin ? handlerClickCell : undefined}
      style={{
        cursor: shift && profile.isAdmin ? 'pointer' : 'default',
        backgroundColor: shift ? shiftColor[shift.priority] : '#fff',
        color:
          shift?.priority === ShiftPriority.TYC ||
          shift?.priority === ShiftPriority.ANL3
            ? '#fff'
            : theme.palette.text.primary,
      }}
    >
      {shiftLabel()}
    </RosterCell>
  );
};

export default RosterBodyCell;
