import { FC, useEffect, useState } from 'react';

import NotificationsIcon from '@mui/icons-material/Notifications';

import useShiftList from '../../hooks/useShiftList';
import { Badge } from '@mui/material';

import { ShiftStatus } from '../../interfaces/roster.interface';

const LayoutNavbarNotification: FC = () => {
  const [pendingShifts, setPendingShifts] = useState(0);
  const { shiftList } = useShiftList();

  useEffect(() => {
    if (shiftList) {
      const pending = shiftList.filter(
        shift => shift.status === ShiftStatus.Pending
      ).length;
      setPendingShifts(pending);
    }
  }, [shiftList]);

  return pendingShifts > 0 ? (
    <Badge badgeContent={pendingShifts} color="error" max={99} sx={{ mr: 4 }}>
      <NotificationsIcon color="action" />
    </Badge>
  ) : (
    <NotificationsIcon color="action" sx={{ mr: 2 }} />
  );
};

export default LayoutNavbarNotification;
