import { FC } from 'react';
import { format, isSameDay } from 'date-fns';

import { Box } from '@mui/system';

import usePublicHolidays from '../../hooks/usePublicHolidays';
import useRosterHeader from '../../hooks/useRosterHeader';

const RosterHeader: FC<{ year: number; month: number }> = ({
  year = 2022,
  month = 0,
}) => {
  const { daysAndDatesHeader } = useRosterHeader(year, month);
  const { publicHolidays } = usePublicHolidays();

  const getPublicHoliday = (date: Date) => {
    return publicHolidays.find(holiday => isSameDay(holiday, date));
  };

  return (
    <Box>
      {/* Days */}
      <Box sx={{ display: 'flex' }}>
        {daysAndDatesHeader().days.map((day, index) => (
          <Box key={index} sx={{ minWidth: 40, textAlign: 'center' }}>
            {day}
          </Box>
        ))}
      </Box>

      {/* Dates */}
      <Box sx={{ display: 'flex' }}>
        {daysAndDatesHeader().dates.map((date, index) => (
          <Box key={index} sx={{ minWidth: 40, textAlign: 'center' }}>
            {format(date, 'dd')}
          </Box>
        ))}
      </Box>

      {/* Public Holidays */}
      <Box sx={{ display: 'flex' }}>
        {daysAndDatesHeader().dates.map((date, index) => (
          <Box key={index} sx={{ minWidth: 40, textAlign: 'center' }}>
            {getPublicHoliday(date) ? 'PH' : ''}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RosterHeader;
