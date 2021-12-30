import { useCallback, useEffect, useState } from 'react';
import { addDays, compareAsc } from 'date-fns';

import { Profile } from '../interfaces/auth.interface';
import {
  RosterType,
  ShiftPriority,
  ShiftStatus,
  ShiftType,
} from '../interfaces/roster.interface';

import useShiftList from './useShiftList';
import useUserList from './useUserList';

interface AdminSummary {
  user: Profile;
  total: number;
}

const useAdminSummary = (
  rosterType?: RosterType
): { adminSummary: AdminSummary[] } => {
  const { shiftList } = useShiftList();
  const { userList } = useUserList();
  const [adminSummary, setAdminSummary] = useState<AdminSummary[]>([]);

  const getAdminSummary = useCallback((): AdminSummary[] => {
    const summary: AdminSummary[] = [];

    userList.forEach(user => {
      const shifts = shiftList.filter(
        shift =>
          shift.priority !== ShiftPriority.Carryover &&
          shift.priority !== ShiftPriority.Vaccination &&
          shift.status !== ShiftStatus.Rejected &&
          shift.type !== ShiftType.H &&
          shift.uid === user.uid
      );
      let total = 0;

      shifts.forEach(shift => {
        let initialDate = shift.startDate;

        do {
          total++;
          initialDate = addDays(initialDate, 1);
        } while (compareAsc(initialDate, shift.endDate) <= 0);
      });

      summary.push({
        user,
        total,
      });
    });

    if (rosterType && rosterType === RosterType.Engineer)
      return summary.filter(s => s.user.roster === RosterType.Engineer);

    if (rosterType && rosterType === RosterType.Mechanic)
      return summary.filter(s => s.user.roster === RosterType.Mechanic);

    return summary;
  }, [shiftList, userList, rosterType]);

  useEffect(() => {
    setAdminSummary(getAdminSummary());
  }, [shiftList, userList, getAdminSummary]);

  return { adminSummary };
};

export default useAdminSummary;
