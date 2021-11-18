import { FC } from 'react';
import { isSameDay } from 'date-fns';

import useRosterHeader from '../../hooks/useRosterHeader';
import useRoster from '../../hooks/useRoster';

// styled components
import { RosterRow, RosterCell } from './Roster.style';

// interfaces
import { Profile } from '../../interfaces/auth.interface';

const RosterBody: FC<{ year: number; month: number; userList: Profile[] }> = ({
  year,
  month,
  userList,
}) => {
  const { daysAndDatesHeader } = useRosterHeader(year, month);
  const { roster } = useRoster(year, month);

  const matchRoster = (uid: string, date: Date) => {
    const shift = roster.find(
      shift => isSameDay(shift.date, date) && shift.uid === uid
    );

    return shift ? shift.type.toUpperCase() : '';
  };

  return (
    <div>
      {userList.map(user => (
        <RosterRow key={user.uid}>
          {daysAndDatesHeader().dates.map((date, index) => (
            <RosterCell key={index}>{matchRoster(user.uid, date)}</RosterCell>
          ))}
        </RosterRow>
      ))}
    </div>
  );
};

export default RosterBody;
