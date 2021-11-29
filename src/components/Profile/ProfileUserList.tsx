import { ChangeEvent, FC } from 'react';

// mui
import { FormControl, MenuItem, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Profile } from '../../interfaces/auth.interface';
import useUserList from '../../hooks/useUserList';

interface ProfilePageProps {
  handleSelectedProfileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedProfile: string;
}

const profileUserListOptions = (userList: Profile[]) => {
  const profileUserListOptions = userList.map(user => {
    return {
      value: user.uid,
      label: `${user.firstName} ${user.lastName}`,
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

const ProfileUserList: FC<ProfilePageProps> = ({
  handleSelectedProfileChange,
  selectedProfile = '',
}) => {
  const { userList } = useUserList();
  const options = profileUserListOptions(userList);

  return Array.isArray(options) && options.length > 1 ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      <FormControl
        variant="outlined"
        className="roster-page__form-control"
        sx={{
          minWidth: 200,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
          },
        }}
      >
        <TextField
          onChange={handleSelectedProfileChange}
          select
          size="small"
          value={selectedProfile}
        >
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
    </Box>
  ) : null;
};

export default ProfileUserList;
