import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// mui
import { Box, Card, Divider, Grid, Typography } from '@mui/material';

// hooks
import useProfile from '../hooks/useProfile';
import useProfileSummary from '../hooks/useProfileSummary';

// components
import { ProfileShiftList } from '../components/Profile';
import { ProfilePageSummaryContainer } from './ProfilePage.style';
import useUserList from '../hooks/useUserList';

import { Profile } from '../interfaces/auth.interface';

type ProfilePageParams = {
  uid: string;
};

const ProfilePage: FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<Profile>();
  const { uid } = useParams<ProfilePageParams>();
  const { profile } = useProfile();
  const { profileSummary, prioritySummary } = useProfileSummary(
    uid || profile.uid
  );
  const { userList } = useUserList();

  useEffect(() => {
    if (uid) {
      const selectedProfile = userList.find(user => user.uid === uid);
      setSelectedProfile(selectedProfile);
    } else setSelectedProfile(profile);
  }, [uid, profile, userList]);

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
        <Card className="shadow" sx={{ mb: 2, px: 2, pt: 2, pb: 0 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            {selectedProfile ? (
              <Typography variant="h6">
                {`${selectedProfile?.firstName} ${selectedProfile?.lastName}`}
              </Typography>
            ) : (
              <Typography variant="caption">Loading...</Typography>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {profile &&
              profileSummary().map(detail => (
                <Grid
                  textAlign="center"
                  pb={2}
                  item
                  xs={12}
                  sm={3}
                  key={detail.label}
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
                </Grid>
              ))}
          </Grid>
        </Card>
        <Card className="shadow" sx={{ px: 4, py: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6">Priorities</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {prioritySummary().map(detail => (
              <Grid textAlign="center" item xs={12} sm={3} key={detail.label}>
                <Typography color="grey.600" variant="body1">
                  {detail.label}
                </Typography>
                <Typography color="grey.800" variant="h6">
                  {detail.value ? detail.value : 0}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Card>
      </ProfilePageSummaryContainer>
      <ProfileShiftList
        selectedProfile={selectedProfile ? selectedProfile : profile}
      />
    </div>
  ) : null;
};

export default ProfilePage;
