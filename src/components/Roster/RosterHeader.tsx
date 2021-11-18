import { FC } from 'react';
import { format, isSameDay } from 'date-fns';

// mui
import { Box } from '@mui/system';

// hooks
import usePublicHolidays from '../../hooks/usePublicHolidays';
import useRosterHeader from '../../hooks/useRosterHeader';

// styled components
import { RosterCell, RosterRow } from './Roster.style';

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
      <RosterRow>
        {daysAndDatesHeader().days.map((day, index) => (
          <RosterCell key={index}>{day}</RosterCell>
        ))}
      </RosterRow>

      {/* Dates */}
      <RosterRow>
        {daysAndDatesHeader().dates.map((date, index) => (
          <RosterCell key={index}>{format(date, 'dd')}</RosterCell>
        ))}
      </RosterRow>

      {/* Public Holidays */}
      <RosterRow>
        {daysAndDatesHeader().dates.map((date, index) => (
          <RosterCell key={index}>
            {getPublicHoliday(date) ? 'PH' : ''}
          </RosterCell>
        ))}
      </RosterRow>
    </Box>
  );
};

export default RosterHeader;
