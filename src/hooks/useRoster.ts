import { addDays, compareAsc } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// hooks
import useDaysOff from './useDaysOff';
import useProfile from './useProfile';
import useRosterHeader from './useRosterHeader';
import useShiftList from './useShiftList';

// interfaces
import { Roster, Shift, ShiftStatus } from '../interfaces/roster.interface';

const useRoster = (
  year = 2022,
  month = 0
): {
  disabledDates: (Date | null)[];
  roster: Roster[];
} => {
  const [disabledDates, setDisabledDates] = useState<(Date | null)[]>([]);
  const [roster, setRoster] = useState<Roster[]>([]);
  const { daysOff } = useDaysOff();
  const { fromDate, toDate } = useRosterHeader(year, month);
  const { profile } = useProfile();
  const { shiftList } = useShiftList();

  const getDisabledDates = useCallback(
    (roster: Roster[]) => {
      if (profile.isAdmin) setDisabledDates([]);

      const disabledDates = roster.map(r => {
        if (r.uid === profile.uid) return r.date;
        return null;
      });

      setDisabledDates(disabledDates.filter(d => d !== null));
    },
    [profile]
  );

  const transformDataToRoster = useCallback(
    (records: Shift[]): Roster[] => {
      const roster: Roster[] = [];

      records.forEach(record => {
        const {
          endDate,
          priority,
          roster: rosterType,
          startDate,
          status,
          type,
          uid,
        } = record;
        let initialDate = startDate;

        do {
          if (status !== ShiftStatus.Rejected) {
            const date = initialDate;
            const id = uuidv4();
            const shiftId = record.id;

            roster.push({
              date,
              id,
              priority,
              roster: rosterType,
              shiftId,
              status,
              type,
              uid,
            });
          }

          initialDate = addDays(initialDate, 1);
        } while (compareAsc(initialDate, endDate) <= 0);
      });

      const filteredRoster = roster.filter(
        record =>
          compareAsc(record.date, fromDate()) >= 0 &&
          compareAsc(record.date, toDate()) <= 0
      );

      const sortedRoster = filteredRoster.sort((a, b) =>
        compareAsc(a.date, b.date)
      );

      return sortedRoster;
    },
    [fromDate, toDate]
  );

  useEffect(() => {
    const off = transformDataToRoster(daysOff);
    const shifts = transformDataToRoster(shiftList);

    setRoster(off.concat(shifts));
  }, [daysOff, transformDataToRoster, shiftList]);

  useEffect(() => {
    getDisabledDates(roster);
  }, [getDisabledDates, roster]);

  return { disabledDates, roster };
};

export default useRoster;
