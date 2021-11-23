import { ChangeEvent, FC } from 'react';

// mui
import { FormControl, MenuItem, TextField } from '@mui/material';
import { Box } from '@mui/system';

interface ProfilePageProps {
  handleSelectedProfileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  options: { label: string; value: string }[];
  selectedProfile: string;
}

const ProfileUserList: FC<ProfilePageProps> = ({
  handleSelectedProfileChange,
  options,
  selectedProfile,
}) => {
  return (
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
          {Array.isArray(options) && options.length > 0 ? (
            options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="">No profiles</MenuItem>
          )}
        </TextField>
      </FormControl>
    </Box>
  );
};

export default ProfileUserList;
