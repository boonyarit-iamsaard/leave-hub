import { FC } from 'react';
import { format, isSameDay } from 'date-fns';

import { Box } from '@mui/system';

import usePublicHolidays from '../../hooks/usePublicHolidays';
import useRosterHeader from '../../hooks/useRosterHeader';
import { RosterBodyCell } from './RosterBody.style';

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
          <RosterBodyCell key={index}>{day}</RosterBodyCell>
        ))}
      </Box>

      {/* Dates */}
      <Box sx={{ display: 'flex' }}>
        {daysAndDatesHeader().dates.map((date, index) => (
          <RosterBodyCell key={index}>{format(date, 'dd')}</RosterBodyCell>
        ))}
      </Box>

      {/* Public Holidays */}
      <Box sx={{ display: 'flex' }}>
        {daysAndDatesHeader().dates.map((date, index) => (
          <RosterBodyCell key={index}>
            {getPublicHoliday(date) ? 'PH' : ''}
          </RosterBodyCell>
        ))}
      </Box>
    </Box>
  );
};

export default RosterHeader;
