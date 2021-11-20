import { FC, useEffect, useState } from 'react';

import useRosterHeader from '../../hooks/useRosterHeader';
import useRoster from '../../hooks/useRoster';

// styled components
import { RosterBodyFirstColumn, RosterRow } from './Roster.style';

// interfaces
import { Profile } from '../../interfaces/auth.interface';
import { Roster } from '../../interfaces/roster.interface';

// components
import RosterBodyCell from './RosterBodyCell';

interface RosterBodyProps {
  year: number;
  month: number;
  userList: Profile[];
  handleEditDialogOpen: (shift: Roster) => void;
}

const RosterBody: FC<RosterBodyProps> = ({
  year,
  month,
  userList,
  handleEditDialogOpen,
}) => {
  const [rosterData, setRosterData] = useState<Roster[]>([] as Roster[]);
  const { daysAndDatesHeader } = useRosterHeader(year, month);
  const { roster } = useRoster(year, month);

  useEffect(() => {
    setRosterData(roster);
  }, [roster]);

  return (
    <div>
      {userList.map((user, userIndex) => (
        <RosterRow key={userIndex}>
          <RosterBodyFirstColumn>{user.firstName}</RosterBodyFirstColumn>

          {daysAndDatesHeader().dates.map((date, index) => (
            <RosterBodyCell
              key={index}
              roster={rosterData}
              date={date}
              uid={user.uid}
              handleEditDialogOpen={handleEditDialogOpen}
            />
          ))}
        </RosterRow>
      ))}
    </div>
  );
};

export default RosterBody;
