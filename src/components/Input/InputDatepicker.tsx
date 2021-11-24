import { FC, Fragment } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { isSameDay } from 'date-fns';

import { Box } from '@mui/system';
import { MobileDatePicker } from '@mui/lab';
import { TextField, Typography } from '@mui/material';

import useRoster from '../../hooks/useRoster';
import useProfile from '../../hooks/useProfile';

interface InputDatepickerProps {
  name: string;
  label: string;
  minDate?: Date;
}

const shouldDisableDate = (
  date: Date | null,
  disabledDates: (Date | null)[]
) => {
  let occupiedDate: Date | null | undefined;
  if (date !== null) {
    occupiedDate = disabledDates.find(d => isSameDay(date as Date, d as Date));
  }
  return occupiedDate ? true : false;
};

const InputDatepicker: FC<InputDatepickerProps> = ({
  label,
  name,
  minDate,
}) => {
  const { control, watch } = useFormContext();
  const { disabledDates } = useRoster();
  const { profile } = useProfile();
  const { endDate, startDate } = watch();

  const isStartDateOccupied = shouldDisableDate(startDate, disabledDates);
  const isEndDateOccupied = shouldDisableDate(endDate, disabledDates);

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
              shouldDisableDate={(date: Date) =>
                date !== null && !profile.isAdmin
                  ? shouldDisableDate(date, disabledDates)
                  : false
              }
              value={field.value}
              renderInput={params => (
                <TextField
                  helperText={
                    isStartDateOccupied || isEndDateOccupied
                      ? 'Please select an available date'
                      : ''
                  }
                  fullWidth
                  variant="outlined"
                  {...params}
                />
              )}
            />
          )}
        />
      </Box>
    </Fragment>
  );
};

export default InputDatepicker;
