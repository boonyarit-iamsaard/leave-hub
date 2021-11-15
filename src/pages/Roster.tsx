import { FC } from 'react';

import useDaysOff from '../hooks/useDaysOff';

const Roster: FC = () => {
  const { daysOff } = useDaysOff();

  return (
    <div>
      <p>Roster - Page</p>
      <pre>{JSON.stringify(daysOff, null, 2)}</pre>
    </div>
  );
};

export default Roster;
