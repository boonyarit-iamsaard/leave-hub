import { FC } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { Backdrop, Button, Card } from '@mui/material';

import { database } from '../../firebase/config';
import { ref, set } from '@firebase/database';

import { InputDatepicker } from '../Input';

interface IRosterForm {
  startDate: Date;
  endDate: Date;
}

const RosterForm: FC<{ handleDialogOpen: () => void; dialogOpen: boolean }> = ({
  handleDialogOpen,
  dialogOpen,
}) => {
  const methods = useForm<IRosterForm>({
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });
  const { handleSubmit } = methods;

  // TODO: add to handleSubmit later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmitRosterForm = (data: IRosterForm) => {
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

    handleDialogOpen();
  };

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: theme => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(3px)',
      }}
      onClick={handleDialogOpen}
      open={dialogOpen}
    >
      <Card
        className="shadow"
        style={{ width: '100%', maxWidth: 400 }}
        sx={{ mx: 'auto', mb: 2, p: 2 }}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(data => handleSubmitRosterForm(data))}>
            <InputDatepicker label="Start Date" name="startDate" />

            <InputDatepicker label="End Date" name="endDate" />

            <Button fullWidth variant="contained" size="large" type="submit">
              Save
            </Button>
          </form>
        </FormProvider>
      </Card>
    </Backdrop>
  );
};

export default RosterForm;
