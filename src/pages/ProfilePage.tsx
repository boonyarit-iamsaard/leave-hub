import { ChangeEvent, FC, useEffect, useState } from 'react';

// mui
import { Box, Card, Divider, Typography } from '@mui/material';

// hooks
import useProfile from '../hooks/useProfile';
import useProfileSummary from '../hooks/useProfileSummary';

// components
import { ProfileShiftList, ProfileUserList } from '../components/Profile';
import { ProfilePageSummaryContainer } from './ProfilePage.style';

const ProfilePage: FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const { profile } = useProfile();
  const { profileSummary, prioritySummary } = useProfileSummary(
    profile.isAdmin ? selectedProfile : profile.uid
  );

  const handleSelectedProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedProfile(e.target.value);
  };

  useEffect(() => {
    if (profile.isAdmin) {
      setSelectedProfile(profile.uid);
    }
  }, [profile]);

  return profile ? (
    <div>
      <Box
        sx={{
          px: 2,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">Profile</Typography>
      </Box>
      <ProfilePageSummaryContainer>
        <Card className="shadow" sx={{ mb: 2, px: 4, py: 2 }}>
          {profile && profile.isAdmin ? (
            <ProfileUserList
              handleSelectedProfileChange={handleSelectedProfileChange}
              selectedProfile={selectedProfile}
            />
          ) : (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h6">
                {profile
                  ? `${profile.firstName} ${profile.lastName}`
                  : 'Loading...'}
              </Typography>
            </Box>
          )}
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
            {prioritySummary().map(detail => (
              <Box
                key={detail.label}
                sx={{ textAlign: 'center', mb: { xs: 1, sm: 0 } }}
              >
                <Typography color="grey.600" variant="body1">
                  {detail.label}
                </Typography>
                <Typography color="grey.800" variant="h6">
                  {detail.value ? detail.value : 0}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>
      </ProfilePageSummaryContainer>
      <ProfileShiftList
        selectedProfile={profile.isAdmin ? selectedProfile : profile.uid}
      />
    </div>
  ) : null;
};

export default ProfilePage;
