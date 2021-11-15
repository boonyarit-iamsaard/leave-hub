import { FC, useState } from 'react';

import { Button, Card, Typography } from '@mui/material';
import { Box } from '@mui/system';

// components
import { RosterForm } from '../components/Roster';

// hooks
import useRoster from '../hooks/useRoster';

const RosterPage: FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { roster } = useRoster();

  const handleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
  };

  return (
    <Box>
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

      <RosterForm handleDialogOpen={handleDialogOpen} dialogOpen={dialogOpen} />

      <Card className="shadow" sx={{ mb: 2, p: 2 }}>
        <pre>{JSON.stringify(roster, null, 2)}</pre>
      </Card>
    </Box>
  );
};

export default RosterPage;
