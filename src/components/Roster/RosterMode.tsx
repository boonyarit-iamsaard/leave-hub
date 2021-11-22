import { ChangeEvent, FC } from 'react';

import { FormControl, MenuItem, TextField } from '@mui/material';

import { RosterType } from '../../interfaces/roster.interface';
import useProfile from '../../hooks/useProfile';

interface RosterModeProps {
  mode: RosterType | string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const rosterModeOptions = [
  {
    value: 'All Leaves',
    label: 'All Leaves',
  },
  {
    value: RosterType.Engineer,
    label: 'Engineer',
  },
  {
    value: RosterType.Mechanic,
    label: 'Mechanic',
  },
];

const RosterMode: FC<RosterModeProps> = ({
  mode = RosterType.Mechanic,
  onChange,
}) => {
  const { profile } = useProfile();

  return (
    <FormControl
      variant="outlined"
      className="roster-page__form-control"
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'white',
        },
      }}
    >
      <TextField
        onChange={onChange}
        select
        size="small"
        sx={{ mr: 1 }}
        value={mode}
      >
        {rosterModeOptions.map(option => (
          <MenuItem
            disabled={!profile.isAdmin && option.value === 'All Leaves'}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
};

export default RosterMode;
