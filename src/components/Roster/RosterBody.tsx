import { FC } from 'react';
import { isSameDay } from 'date-fns';

import useRosterHeader from '../../hooks/useRosterHeader';
import useRoster from '../../hooks/useRoster';

// styled components
import { RosterBodyCell, RosterBodyRow } from './RosterBody.style';

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
        <RosterBodyRow key={user.uid}>
          {daysAndDatesHeader().dates.map((date, index) => (
            <RosterBodyCell key={index}>
              {matchRoster(user.uid, date)}
            </RosterBodyCell>
          ))}
        </RosterBodyRow>
      ))}
    </div>
  );
};

export default RosterBody;
