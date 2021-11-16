import { useCallback } from 'react';
import { format, addHours } from 'date-fns';

const useRosterHeader = (
  year: number,
  month: number
): {
  fromDate: () => Date;
  toDate: () => Date;
  daysInMonth: () => number;
  daysAndDatesHeader: () => {
    days: string[];
    dates: Date[];
  };
} => {
  // TODO: fix add +7 hours
  const fromDate = useCallback(
    () => addHours(new Date(year, month, 1), 7),
    [year, month]
  );
  const toDate = useCallback(
    () => addHours(new Date(year, month + 1, 0), 7),
    [year, month]
  );
  const daysInMonth = useCallback(() => toDate().getDate(), [toDate]);

  const daysAndDatesHeader = useCallback(() => {
    const days: string[] = [];
    const dates: Date[] = [];
    const from = fromDate();
    const to = toDate();

    for (let i = from.getDate(); i <= to.getDate(); i++) {
      days.push(format(new Date(year, month, i), 'EEEEEE'));
      dates.push(new Date(year, month, i));

      if (i === daysInMonth()) {
        break;
      }
    }

    return { days, dates };
  }, [fromDate, toDate, daysInMonth, year, month]);

  return {
    fromDate,
    toDate,
    daysInMonth,
    daysAndDatesHeader,
  };
};

export default useRosterHeader;
