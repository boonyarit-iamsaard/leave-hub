import { useCallback, useEffect, useState } from 'react';
import { addDays, compareAsc } from 'date-fns';

import useProfile from './useProfile';
import useShiftList from './useShiftList';

import { Shift, ShiftStatus } from '../interfaces/roster.interface';

const useProfileSummary = (): {
  prioritySummary: () => {
    label: string;
    value: number;
  }[];
  profileSummary: () => {
    label: string;
    value: number;
    percentage: string;
  }[];
} => {
  // hooks
  const { profile } = useProfile();
  const { shiftList } = useShiftList();
  // local states
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([] as Shift[]);
  const [shiftsCount, setShiftsCount] = useState({
    shifts: {
      X: 0,
      ANL: 0,
      H: 0,
    },
    priorities: {
      X: 0,
      ANL: 0,
      H: 0,
      ANL1: 0,
      ANL2: 0,
      ANL3: 0,
      TYC: 0,
    },
  });
  const priorities = {
    ANL1: 1,
    ANL2: 1,
    ANL3: profile.entitled,
    TYC: profile.tyc,
  };

  const profileSummary = useCallback(
    () => [
      {
        label: 'Entitled',
        value: profile.entitled,
        percentage: Math.floor(100).toFixed(2),
      },
      {
        label: 'Used',
        value: shiftsCount.shifts.ANL,
        percentage: Math.floor(
          (shiftsCount.shifts.ANL / profile.entitled) * 100
        ).toFixed(2),
      },
      {
        label: 'Remaining',
        value: profile ? profile.entitled - shiftsCount.shifts.ANL : 0,
        percentage: Math.floor(
          ((profile.entitled - shiftsCount.shifts.ANL) / profile.entitled) * 100
        ).toFixed(2),
      },
      {
        label: 'Carryover',
        value: profile.carryover ? profile.carryover : 0,
        percentage: 'N/A',
      },
    ],
    [profile, shiftsCount.shifts.ANL]
  );

  const prioritySummary = useCallback(
    () => [
      {
        label: 'ANL1',
        value: priorities.ANL1 - shiftsCount.priorities.ANL1,
      },
      {
        label: 'ANL2',
        value: priorities.ANL2 - shiftsCount.priorities.ANL2,
      },
      {
        label: 'ANL3',
        value: profile.entitled - shiftsCount.shifts.ANL,
      },
      {
        label: 'TYC',
        value: priorities.TYC - shiftsCount.priorities.TYC,
      },
    ],
    [
      profile.entitled,
      priorities.ANL1,
      shiftsCount.priorities.ANL1,
      priorities.ANL2,
      shiftsCount.priorities.ANL2,
      priorities.TYC,
      shiftsCount.priorities.TYC,
      shiftsCount.shifts.ANL,
    ]
  );

  const getShiftsCount = useCallback(() => {
    const shifts = {
      X: 0,
      ANL: 0,
      H: 0,
    };
    const priorities = {
      X: 0,
      ANL: 0,
      H: 0,
      ANL1: 0,
      ANL2: 0,
      ANL3: 0,
      TYC: 0,
    };

    filteredShifts.forEach(shift => {
      if (shift.status !== ShiftStatus.Rejected) {
        let initialDate = shift.startDate;
        do {
          shifts[shift.type]++;
          initialDate = addDays(initialDate, 1);
        } while (compareAsc(initialDate, shift.endDate) <= 0);

        if (shift.priority) priorities[shift.priority]++;
      }
    });

    setShiftsCount({ priorities, shifts });
  }, [filteredShifts]);

  useEffect(() => {
    const filteredShifts = shiftList.filter(shift => shift.uid === profile.uid);
    setFilteredShifts(filteredShifts);
  }, [shiftList, profile.uid]);

  useEffect(() => {
    getShiftsCount();
  }, [filteredShifts, getShiftsCount]);

  return { prioritySummary, profileSummary };
};

export default useProfileSummary;
