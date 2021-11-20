import { FC } from 'react';
import { format, isSameDay } from 'date-fns';

// mui
import {
  red,
  purple,
  pink,
  green,
  yellow,
  blue,
  orange,
  grey,
  indigo,
} from '@mui/material/colors';
import { Box } from '@mui/system';

// hooks
import usePublicHolidays from '../../hooks/usePublicHolidays';
import useRosterHeader from '../../hooks/useRosterHeader';

// styled components
import {
  RosterHeaderColumn,
  RosterHeaderFirstColumn,
  RosterRow,
} from './Roster.style';

const RosterHeaderDayColumn: FC<{ day: string }> = ({ day }) => {
  const dayColor: { [key: string]: string } = {
    Su: red['300'],
    Sa: purple['300'],
    Mo: yellow['300'],
    Tu: pink['300'],
    We: green['300'],
    Th: orange['300'],
    Fr: blue['300'],
  };
  return (
    <RosterHeaderColumn
      style={{
        backgroundColor: dayColor[day],
      }}
    >
      <Box>{day}</Box>
    </RosterHeaderColumn>
  );
};

const RosterHeaderPHColumn: FC<{ date: Date }> = ({ date }) => {
  const { publicHolidays } = usePublicHolidays();

  const getPublicHoliday = (date: Date) => {
    return publicHolidays.find(holiday => isSameDay(holiday, date));
  };

  const isPublicHoliday = getPublicHoliday(date);

  return (
    <RosterHeaderColumn
      style={{
        backgroundColor: isPublicHoliday ? indigo['300'] : '',
      }}
    >
      {isPublicHoliday ? 'PH' : ''}
    </RosterHeaderColumn>
  );
};

const RosterHeader: FC<{ year: number; month: number }> = ({
  year = 2022,
  month = 0,
}) => {
  const { daysAndDatesHeader } = useRosterHeader(year, month);

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 3 }}>
      <RosterRow>
        <RosterHeaderFirstColumn style={{ borderTop: '1px solid' + grey[300] }}>
          DATE
        </RosterHeaderFirstColumn>
        {daysAndDatesHeader().dates.map((date, index) => (
          <RosterHeaderColumn
            key={index}
            style={{ borderTop: '1px solid' + grey[300] }}
          >
            {format(date, 'dd')}
          </RosterHeaderColumn>
        ))}
      </RosterRow>
      <RosterRow>
        <RosterHeaderFirstColumn>DAY</RosterHeaderFirstColumn>
        {daysAndDatesHeader().days.map((day, index) => (
          <RosterHeaderDayColumn day={day} key={index} />
        ))}
      </RosterRow>
      <RosterRow>
        <RosterHeaderFirstColumn>PH</RosterHeaderFirstColumn>
        {daysAndDatesHeader().dates.map((date, index) => (
          <RosterHeaderPHColumn date={date} key={index} />
        ))}
      </RosterRow>
    </Box>
  );
};

export default RosterHeader;
