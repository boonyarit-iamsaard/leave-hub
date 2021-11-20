import { useEffect, useState } from 'react';

import { realtimeDatabase } from '../firebase/config';
import {
  ref,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onValue,
} from 'firebase/database';

// interfaces
import { Shift } from '../interfaces/roster.interface';

const useDaysOff = (): { daysOff: Shift[] } => {
  const [daysOff, setDaysOff] = useState<Shift[]>([]);

  useEffect(() => {
    const daysOff: Shift[] = [];
    const daysOffRef = ref(realtimeDatabase, 'days-off');

    const daysOffListener = onValue(
      daysOffRef,
      snapshot => {
        snapshot.forEach(childSnapshot => {
          const dayOff: Shift = {
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
      const dayOffData: Shift = {
        ...dayOff.val(),
        id: dayOff.key,
        // transform the date from firebase to a date object
        startDate: new Date(dayOff.val().startDate),
        endDate: new Date(dayOff.val().endDate),
      };

      // setDaysOff([...daysOff, dayOffData]);
      setDaysOff(prevState => prevState.concat(dayOffData));
    });

    const onDayOffChangedListener = onChildChanged(daysOffRef, dayOff => {
      const dayOffIndex = daysOff.findIndex(({ id }) => id === dayOff.key);

      const dayOffData: Shift = {
        ...dayOff.val(),
        id: dayOff.key,
        // transform the date from firebase to a date object
        startDate: new Date(dayOff.val().startDate),
        endDate: new Date(dayOff.val().endDate),
      };

      setDaysOff(prevState => {
        const newState = [...prevState];
        newState[dayOffIndex] = dayOffData;
        return newState;
      });
    });

    const onDayOffRemovedListener = onChildRemoved(daysOffRef, dayOff => {
      setDaysOff(prevState => prevState.filter(({ id }) => id !== dayOff.key));
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
