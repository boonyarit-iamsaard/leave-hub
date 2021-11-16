import { addDays, compareAsc } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import useDaysOff, { IShift } from './useDaysOff';
import useRosterHeader from './useRosterHeader';

interface Roster {
  id: string;
  shiftId: string;
  uid: string;
  date: Date;
  type: string;
  roster: string;
}

const useRoster = (year = 2022, month = 0): { roster: Roster[] } => {
  const { fromDate, toDate } = useRosterHeader(year, month);
  const [roster, setRoster] = useState<Roster[]>([]);
  const { daysOff } = useDaysOff();

  const transformDataToRoster = useCallback(
    (records: IShift[]): Roster[] => {
      const roster: Roster[] = [];

      records.forEach(record => {
        const { startDate, endDate, type, uid, roster: rosterType } = record;
        let initialDate = startDate;

        do {
          const date = initialDate;
          const id = uuidv4();
          const shiftId = record.id;

          roster.push({
            id,
            shiftId,
            uid,
            date,
            type,
            roster: rosterType,
          });

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
    const roster = transformDataToRoster(daysOff);

    setRoster(roster);
  }, [daysOff, transformDataToRoster]);

  return { roster };
};

export default useRoster;
