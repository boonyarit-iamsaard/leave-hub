import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { Box } from '@mui/system';
import { Backdrop, Button, Card, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/lab';

import { database } from '../../firebase/config';
import { ref, set } from '@firebase/database';

interface IFormData {
  startDate: Date;
  endDate: Date;
}

const RosterForm: FC<{ handleDialogOpen: () => void; dialogOpen: boolean }> = ({
  handleDialogOpen,
  dialogOpen,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const handleSubmitRosterForm = (data: IFormData) => {
    const uid = 'jG4T6XMZu4X3Cs2sfgprpIvOfzz2';
    const id = uuidv4();

    const shift = {
      startDate: data.startDate,
      endDate: data.endDate,
      uid,
      roster: 'mechanic',
      type: 'x',
    };

    set(ref(database, 'days-off/' + id), {
      ...shift,

      // transform the date into a string before saving
      startDate: format(shift.startDate, 'yyyy-MM-dd'),
      endDate: format(shift.endDate, 'yyyy-MM-dd'),
    });
  };

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: theme => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(3px)',
      }}
      open={dialogOpen}
      onClick={handleDialogOpen}
    >
      <Card
        className="shadow"
        style={{ width: '100%', maxWidth: 400 }}
        sx={{ mx: 'auto', mb: 2, p: 2 }}
      >
        <form onSubmit={handleSubmit(data => handleSubmitRosterForm(data))}>
          <Box sx={{ mb: 1 }}>
            <label htmlFor="startDate">
              <Typography variant="body1">Start Date</Typography>
            </label>
          </Box>
          <Box mb={2}>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={(date: Date | null) => field.onChange(date)}
                  renderInput={params => (
                    <TextField
                      error={!!errors.startDate}
                      fullWidth
                      {...params}
                      variant="outlined"
                    />
                  )}
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 1 }}>
            <label htmlFor="endDate">
              <Typography variant="body1">End Date</Typography>
            </label>
          </Box>
          <Box mb={2}>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={(date: Date | null) => field.onChange(date)}
                  renderInput={params => (
                    <TextField
                      error={!!errors.endDate}
                      fullWidth
                      {...params}
                      variant="outlined"
                    />
                  )}
                />
              )}
            />
          </Box>

          <Button fullWidth variant="contained" size="large" type="submit">
            Save
          </Button>
        </form>
      </Card>
    </Backdrop>
  );
};

export default RosterForm;
