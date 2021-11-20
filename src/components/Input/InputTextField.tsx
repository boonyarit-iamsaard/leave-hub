import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormHelperText,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

interface InputTextFieldProps {
  label: string;
  name: string;
  type?: string;
  error?: string;
}

const InputTextField: FC<InputTextFieldProps> = ({
  label,
  name,
  type = 'text',
  error,
}) => {
  const { control } = useFormContext();

  return (
    <FormControl error={!!error} fullWidth sx={{ mb: 2 }}>
      <Box mb={1}>
        <label htmlFor={name}>
          <Typography variant="caption">{label}</Typography>
        </label>
      </Box>

      <Controller
        control={control}
        name={name}
        render={({ field }) => <OutlinedInput type={type} {...field} />}
      />

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default InputTextField;
