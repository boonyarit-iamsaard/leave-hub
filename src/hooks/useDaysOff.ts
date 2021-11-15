import { useEffect, useState } from 'react';

import { database } from '../firebase/config';
import { ref, onChildAdded, onChildChanged, onValue } from 'firebase/database';

export interface IShift {
  id: string;
  uid: string;
  startDate: string;
  endDate: string;
  type: string;
  roster: string;
}

const useDaysOff = (): { daysOff: IShift[] } => {
  const [daysOff, setDaysOff] = useState<IShift[]>([]);

  useEffect(() => {
    const daysOff: IShift[] = [];
    const daysOffRef = ref(database, 'days-off');

    const daysOffListener = onValue(
      daysOffRef,
      snapshot => {
        snapshot.forEach(childSnapshot => {
          const dayOff: IShift = {
            id: childSnapshot.key,
            ...childSnapshot.val(),
          };

          daysOff.push(dayOff);
        });

        setDaysOff(daysOff);
      },
      {
        onlyOnce: true,
      }
    );

    const onDayOffChangedListener = onChildChanged(daysOffRef, dayOff => {
      const dayOffIndex = daysOff.findIndex(({ id }) => id === dayOff.key);

      if (dayOffIndex !== -1) {
        daysOff[dayOffIndex] = {
          id: dayOff.key,
          ...dayOff.val(),
        };
      }

      setDaysOff([...daysOff]);
    });

    const onDayOffAddedListener = onChildAdded(daysOffRef, dayOff => {
      const dayOffIndex = daysOff.findIndex(({ id }) => id === dayOff.key);

      if (dayOffIndex === -1) {
        daysOff.push({
          id: dayOff.key,
          ...dayOff.val(),
        });
      }

      setDaysOff([...daysOff]);
    });

    return () => {
      daysOffListener();
      onDayOffAddedListener();
      onDayOffChangedListener();
    };
  }, []);

  return { daysOff };
};

export default useDaysOff;
