import { FC, Fragment } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Box } from '@mui/system';
import { MobileDatePicker } from '@mui/lab';
import { TextField, Typography } from '@mui/material';

const InputDatepicker: FC<{ label: string; name: string }> = ({
  label,
  name,
}: {
  label: string;
  name: string;
}) => {
  const { control } = useFormContext();

  return (
    <Fragment>
      <Box sx={{ mb: 1 }}>
        <label htmlFor={name}>
          <Typography variant="body1">{label}</Typography>
        </label>
      </Box>

      <Box mb={2}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <MobileDatePicker
              disableCloseOnSelect
              readOnly
              value={field.value}
              onChange={(date: Date | null) => field.onChange(date)}
              renderInput={params => (
                <TextField fullWidth {...params} variant="outlined" />
              )}
            />
          )}
        />
      </Box>
    </Fragment>
  );
};

export default InputDatepicker;
