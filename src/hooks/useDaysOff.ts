import { useEffect, useState } from 'react';

import { realtimeDatabase } from '../firebase/config';
import { ref, onValue } from 'firebase/database';

// interfaces
import { Roster, Shift } from '../interfaces/roster.interface';

const useDaysOff = (): {
  daysOff: Shift[];
  findDayOff: (roster: Roster) => Shift | undefined;
} => {
  const [daysOff, setDaysOff] = useState<Shift[]>([]);

  const findDayOff = (roster: Roster) => {
    return daysOff.find(dayOff => dayOff.id === roster.shiftId);
  };

  useEffect(() => {
    const daysOffRef = ref(realtimeDatabase, 'days-off');

    const daysOffListener = onValue(
      daysOffRef,
      snapshot => {
        const daysOffSnapshot: Shift[] = [];
        snapshot.forEach(childSnapshot => {
          const dayOff: Shift = {
            ...childSnapshot.val(),
            id: childSnapshot.key,
            // transform the date from firebase to a date object
            startDate: new Date(childSnapshot.val().startDate),
            endDate: new Date(childSnapshot.val().endDate),
          };

          daysOffSnapshot.push(dayOff);
        });

        setDaysOff(daysOffSnapshot);
      }
      // {
      //   onlyOnce: true,
      // }
    );

    return () => {
      daysOffListener();
    };
  }, []);

  return { daysOff, findDayOff };
};

export default useDaysOff;
