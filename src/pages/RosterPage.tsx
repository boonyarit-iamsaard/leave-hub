import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';

import { Button, Card, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';

// components
import { RosterBody, RosterForm, RosterHeader } from '../components/Roster';

// hooks
import useProfile from '../hooks/useProfile';
import useUserList from '../hooks/useUserList';

const RosterPageTitleColumn = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minWidth: 120,
  height: theme.spacing(5),
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
}));

const RosterPage: FC = () => {
  const { profile } = useProfile();
  const { userList } = useUserList();
  const [year, setYear] = useState(2022);
  const [month, setMonth] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
  };

  const handlePreviousClick = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextClick = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  useEffect(() => {
    const rosterBody = document.getElementById('roster-body');
    rosterBody?.scrollTo({
      left: -10000,
      behavior: 'smooth',
    });
  }, [year, month]);

  return (
    <Box sx={{ width: '100%', maxWidth: 'lg', mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography>Roster - Page</Typography>

        <Button onClick={handleDialogOpen} variant="contained">
          New
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Button variant="outlined" onClick={handlePreviousClick}>
          Previous
        </Button>

        <Typography variant="h5">
          {format(new Date(year, month), 'MMMM yyyy')}
        </Typography>

        <Button variant="outlined" onClick={handleNextClick}>
          Next
        </Button>
      </Box>

      <RosterForm
        dialogOpen={dialogOpen}
        handleDialogOpen={handleDialogOpen}
        month={month}
        profile={profile}
        year={year}
      />

      {/* Roster */}
      <Card className="shadow" sx={{ display: 'flex', flexShrink: 0, p: 2 }}>
        <Box sx={{ minWidth: 120 }}>
          <RosterPageTitleColumn>DAY</RosterPageTitleColumn>
          <RosterPageTitleColumn>DATE</RosterPageTitleColumn>
          <RosterPageTitleColumn>PH</RosterPageTitleColumn>
          <RosterPageTitleColumn>Boonyarit</RosterPageTitleColumn>
        </Box>
        <Box id="roster-body" sx={{ overflow: 'auto' }}>
          <RosterHeader year={year} month={month} />

          <RosterBody year={year} month={month} userList={userList} />
        </Box>
      </Card>
    </Box>
  );
};

export default RosterPage;
