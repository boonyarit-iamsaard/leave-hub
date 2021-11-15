import { useEffect, useState } from 'react';

import { database } from '../firebase/config';
import {
  ref,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
} from 'firebase/database';

export interface IShift {
  id: string;
  uid: string;
  startDate: Date;
  endDate: Date;
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
            ...childSnapshot.val(),
            id: childSnapshot.key,
            // transform the date from firebase to a date object
            startDate: new Date(childSnapshot.val().startDate),
            endDate: new Date(childSnapshot.val().endDate),
          };

          daysOff.push(dayOff);
        });

        setDaysOff(daysOff);
      },
      {
        onlyOnce: true,
      }
    );

    const onDayOffAddedListener = onChildAdded(daysOffRef, dayOff => {
      const dayOffData: IShift = {
        ...dayOff.val(),
        id: dayOff.key,
        // transform the date from firebase to a date object
        startDate: new Date(dayOff.val().startDate),
        endDate: new Date(dayOff.val().endDate),
      };

      setDaysOff([...daysOff, dayOffData]);
    });

    const onDayOffChangedListener = onChildChanged(daysOffRef, dayOff => {
      const dayOffIndex = daysOff.findIndex(({ id }) => id === dayOff.key);

      if (dayOffIndex !== -1) {
        daysOff[dayOffIndex] = {
          ...dayOff.val(),
          id: dayOff.key,
          // transform the date from firebase to a date object
          startDate: new Date(dayOff.val().startDate),
          endDate: new Date(dayOff.val().endDate),
        };
      }

      setDaysOff([...daysOff]);
    });

    const onDayOffRemovedListener = onChildRemoved(daysOffRef, dayOff => {
      const updatedDaysOff = daysOff.filter(({ id }) => id !== dayOff.key);

      setDaysOff([...updatedDaysOff]);
    });

    return () => {
      daysOffListener();
      onDayOffAddedListener();
      onDayOffChangedListener();
      onDayOffRemovedListener();
    };
  }, []);

  return { daysOff };
};

export default useDaysOff;
