import { FC } from 'react';

// mui
import { Box, Card } from '@mui/material';

// hooks
import useProfile from '../hooks/useProfile';

const ProfilePage: FC = () => {
  const { profile } = useProfile();
  const priorities = [
    {
      name: 'ANL1',
      value: 1,
    },
    {
      name: 'ANL2',
      value: 1,
    },
    {
      name: 'ANL3',
      value: profile.entitled,
    },
    {
      name: 'TYC',
      value: profile.tyc,
    },
  ];

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Card
        className="shadow"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          mb: 2,
        }}
      >
        <p>{profile.firstName}</p>
        <p>{profile.lastName}</p>
        <p>Entitled: {profile.entitled}</p>
      </Card>

      <Card
        className="shadow"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          mb: 2,
        }}
      >
        {profile &&
          priorities.map(priority => (
            <p key={priority.name}>
              {priority.name}: {priority.value}
            </p>
          ))}
      </Card>
    </Box>
  );
};

export default ProfilePage;
