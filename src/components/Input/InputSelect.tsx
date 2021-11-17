import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// mui
import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import { Box } from '@mui/system';

interface InputSelectProps {
  disabledOptions?: string[];
  label: string;
  name: string;
  options: string[];
}

const InputSelect: FC<InputSelectProps> = ({
  disabledOptions,
  label,
  name,
  options,
}) => {
  const { control } = useFormContext();

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <Box mb={1}>
        <label htmlFor={name}>
          <Typography variant="caption">{label}</Typography>
        </label>
      </Box>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select {...field}>
            {options.map(option => (
              <MenuItem
                disabled={disabledOptions && disabledOptions.includes(option)}
                key={option}
                value={option}
              >
                {option}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
};

export default InputSelect;
