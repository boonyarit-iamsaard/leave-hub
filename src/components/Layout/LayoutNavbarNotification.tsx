import { FC, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import NotificationsIcon from '@mui/icons-material/Notifications';

import useShiftList from '../../hooks/useShiftList';
import { Badge, IconButton } from '@mui/material';

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
      <IconButton component={RouterLink} to="/admin/pending" sx={{ p: 0 }}>
        <NotificationsIcon color="action" />
      </IconButton>
    </Badge>
  ) : (
    <IconButton sx={{ mr: 2 }}>
      <NotificationsIcon color="action" />
    </IconButton>
  );
};

export default LayoutNavbarNotification;
