import { FC } from 'react';
import { isSameDay } from 'date-fns';

import { Box } from '@mui/system';

import useRosterHeader from '../../hooks/useRosterHeader';
import useRoster from '../../hooks/useRoster';

const staffs = [
  {
    uid: 'jG4T6XMZu4X3Cs2sfgprpIvOfzz2',
    firstName: 'Boonyarit',
  },
];

const RosterBody: FC<{ year: number; month: number }> = ({ year, month }) => {
  const { daysAndDatesHeader } = useRosterHeader(year, month);
  const { roster } = useRoster(year, month);

  const matchRoster = (uid: string, date: Date) => {
    const shift = roster.find(
      shift => isSameDay(shift.date, date) && shift.uid === uid
    );

    return shift ? shift.type.toUpperCase() : '';
  };

  return (
    <Box>
      {staffs.map(staff => (
        <Box sx={{ display: 'flex' }} key={staff.uid}>
          {daysAndDatesHeader().dates.map((date, index) => (
            <Box sx={{ minWidth: 40, textAlign: 'center' }} key={index}>
              {matchRoster(staff.uid, date)}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default RosterBody;
