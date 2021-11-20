import { FC, useEffect } from 'react';

import { Card } from '@mui/material';
import { Box } from '@mui/system';

import { RosterBody, RosterHeader } from '.';

import { Roster, RosterType } from '../../interfaces/roster.interface';

import useUserList from '../../hooks/useUserList';

interface RosterContainerProps {
  handleEditDialogOpen: (roster: Roster) => void;
  year: number;
  month: number;
  rosterType: RosterType;
}

const RosterContainer: FC<RosterContainerProps> = ({
  handleEditDialogOpen,
  year,
  month,
  rosterType = RosterType.Mechanic,
}) => {
  const { userList } = useUserList(rosterType);

  useEffect(() => {
    const rosterBody = document.getElementById('roster-body');
    rosterBody?.scrollTo({
      left: -10000,
      top: 0,
      behavior: 'smooth',
    });
  }, [year, month]);

  return (
    <Card
      className="shadow"
      sx={{
        display: 'flex',
        flexShrink: 0,
        p: 2,
        maxHeight: 600,
      }}
    >
      <Box id="roster-body" sx={{ overflow: 'auto' }}>
        <RosterHeader month={month} year={year} />

        <RosterBody
          handleEditDialogOpen={handleEditDialogOpen}
          month={month}
          userList={userList}
          year={year}
        />
      </Box>
    </Card>
  );
};

export default RosterContainer;
