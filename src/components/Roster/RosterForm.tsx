import { FC } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';

// firebase
import { database } from '../../firebase/config';
import { ref, set } from '@firebase/database';

// components
import { InputDatepicker } from '../Input';

// interfaces
import { RosterFormData } from '../../interfaces/roster.interface';

const RosterForm: FC<{ handleDialogOpen: () => void; dialogOpen: boolean }> = ({
  handleDialogOpen,
  dialogOpen,
}) => {
  const methods = useForm<RosterFormData>({
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });
  const { handleSubmit } = methods;

  const handleSubmitRosterForm = (data: RosterFormData) => {
    const uid = 'jG4T6XMZu4X3Cs2sfgprpIvOfzz2';
    const id = uuidv4();

    const shift = {
      startDate: data.startDate,
      endDate: data.endDate,
      uid,
      roster: 'mechanic',
      type: 'x',
    };

    // TODO: handle error
    set(ref(database, 'days-off/' + id), {
      ...shift,

      // transform the date into a string before saving
      startDate: format(shift.startDate, 'yyyy-MM-dd'),
      endDate: format(shift.endDate, 'yyyy-MM-dd'),
    });

    handleDialogOpen();
  };

  return (
    <Dialog
      className="roster-form"
      sx={{
        color: '#fff',
        zIndex: theme => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(3px)',
        '& .MuiDialog-paper': {
          m: 2,
          width: '100%',
          maxWidth: '400px',
        },
      }}
      open={dialogOpen}
    >
      {' '}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(data => handleSubmitRosterForm(data))}>
          <DialogTitle sx={{ p: 2 }}>Roster Form</DialogTitle>

          <Divider />

          <DialogContent sx={{ width: '100%', mx: 'auto', mb: 2, p: 2 }}>
            <InputDatepicker label="Start Date" name="startDate" />

            <InputDatepicker label="End Date" name="endDate" />
          </DialogContent>

          <Divider />

          <DialogActions
            sx={{
              display: 'flex',
              p: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Button variant="outlined" size="large" onClick={handleDialogOpen}>
              Cancel
            </Button>
            <Button
              className="shadow"
              variant="contained"
              size="large"
              type="submit"
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default RosterForm;
