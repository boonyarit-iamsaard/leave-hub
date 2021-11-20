import { FC, Fragment } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
// import { isSameDay } from 'date-fns';

import { Box } from '@mui/system';
import { MobileDatePicker } from '@mui/lab';
import { TextField, Typography } from '@mui/material';

// import useRoster from '../../hooks/useRoster';

interface InputDatepickerProps {
  name: string;
  label: string;
  minDate?: Date;
}

const InputDatepicker: FC<InputDatepickerProps> = ({
  label,
  name,
  minDate,
}) => {
  const { control } = useFormContext();
  // const { disabledDates } = useRoster();

  return (
    <Fragment>
      <Box sx={{ mb: 1 }}>
        <label htmlFor={name}>
          <Typography variant="caption">{label}</Typography>
        </label>
      </Box>

      <Box mb={2}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <MobileDatePicker
              inputFormat="dd MMMM yyyy"
              minDate={minDate ? minDate : new Date('2000-01-01')}
              onChange={(date: Date | null) => field.onChange(date)}
              // TODO: add shouldDisableDate
              // shouldDisableDate={(date: Date) =>
              //   !!disabledDates.find(d => isSameDay(d as Date, date))
              // }
              value={field.value}
              renderInput={params => (
                <TextField fullWidth variant="outlined" {...params} />
              )}
            />
          )}
        />
      </Box>
    </Fragment>
  );
};

export default InputDatepicker;
