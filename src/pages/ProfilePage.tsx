import { ChangeEvent, FC, useEffect, useState } from 'react';

// mui
import { Box, Card, Divider, Typography } from '@mui/material';

// hooks
import useProfile from '../hooks/useProfile';
import useProfileSummary from '../hooks/useProfileSummary';

// components
import { ProfileShiftList, ProfileUserList } from '../components/Profile';
import { ProfilePageSummaryContainer } from './ProfilePage.style';
import useUserList from '../hooks/useUserList';

// interfaces
import { Profile } from '../interfaces/auth.interface';

const profileUserListOptions = (userList: Profile[]) => {
  const profileUserListOptions = userList.map(user => {
    return {
      value: user.uid,
      label: user.firstName,
    };
  });

  profileUserListOptions.push({ label: '', value: '' });

  return profileUserListOptions.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });
};

const ProfilePage: FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const { profile } = useProfile();
  const { userList } = useUserList();
  const { profileSummary, prioritySummary } = useProfileSummary(
    profile.isAdmin ? selectedProfile : profile.uid
  );

  const options = profileUserListOptions(userList);

  const handleSelectedProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedProfile(e.target.value);
  };

  useEffect(() => {
    if (profile.isAdmin) {
      setSelectedProfile(profile.uid);
    }
  }, [profile]);

  return (
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
          {profile.isAdmin && selectedProfile !== '' ? (
            <ProfileUserList
              handleSelectedProfileChange={handleSelectedProfileChange}
              selectedProfile={selectedProfile}
              options={options}
            />
          ) : (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h6">
                {profile.firstName + ' ' + profile.lastName}
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
  );
};

export default ProfilePage;
