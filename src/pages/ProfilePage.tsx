import { FC } from 'react';

// mui
import { Box, Card, Divider, Typography } from '@mui/material';

// hooks
import useProfile from '../hooks/useProfile';
import useProfileSummary from '../hooks/useProfileSummary';

// components
import { ProfileShiftList } from '../components/Profile';
import { ProfilePageSummaryContainer } from './ProfilePage.style';

const ProfilePage: FC = () => {
  const { profile } = useProfile();
  const { profileSummary, prioritySummary } = useProfileSummary();

  return (
    <div>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">Profile</Typography>
      </Box>
      <ProfilePageSummaryContainer>
        <Card className="shadow" sx={{ mb: 2, px: 4, py: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6">
              {profile.firstName + ' ' + profile.lastName}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {profile &&
              profileSummary &&
              profileSummary().map(detail => (
                <Box
                  key={detail.label}
                  sx={{
                    textAlign: 'center',
                    mb: { xs: 1, sm: 0 },
                  }}
                >
                  <Typography color="grey.600" variant="body1">
                    {detail.label}
                  </Typography>
                  <Typography variant="h6">
                    {detail.value ? detail.value : 0}
                  </Typography>
                  <Typography color="grey.500" variant="caption">
                    ({detail.percentage ? detail.percentage : 0} %)
                  </Typography>
                  <Typography variant="body2">days</Typography>
                </Box>
              ))}
          </Box>
        </Card>
        <Card className="shadow" sx={{ px: 4, py: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6">Priorities</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            {profile &&
              prioritySummary &&
              prioritySummary().map(detail => (
                <Box
                  key={detail.label}
                  sx={{ textAlign: 'center', mb: { xs: 1, sm: 0 } }}
                >
                  <Typography color="grey.600" variant="body1">
                    {detail.label}
                  </Typography>
                  <Typography
                    color={detail.value <= 0 ? 'error' : 'grey.800'}
                    variant="h6"
                  >
                    {detail.value ? detail.value : 0}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Card>
      </ProfilePageSummaryContainer>
      <ProfileShiftList />
    </div>
  );
};

export default ProfilePage;
