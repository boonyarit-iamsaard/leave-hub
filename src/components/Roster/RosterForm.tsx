import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
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
import { realtimeDatabase } from '../../firebase/config';
import { ref, set } from '@firebase/database';

// components
import { InputDatepicker, InputSelect } from '../Input';

// interfaces
import {
  RosterFormData,
  ShiftPriority,
  ShiftType,
} from '../../interfaces/roster.interface';
import { Profile } from '../../interfaces/auth.interface';

// TODO: move to constants folder
// form constants
const defaultValues: RosterFormData = {
  startDate: new Date(),
  endDate: new Date(),
  type: '',
  roster: '',
  priority: '',
};
const shiftTypeOptions: ShiftType[] = [ShiftType.X, ShiftType.ANL, ShiftType.H];
const shiftPriorityOptions: Array<ShiftType | ShiftPriority> = [
  ShiftType.X,
  ShiftType.ANL,
  ShiftType.H,
  ShiftPriority.ANL1,
  ShiftPriority.ANL2,
  ShiftPriority.ANL3,
  ShiftPriority.TYC,
];

const RosterForm: FC<{
  handleDialogOpen: () => void;
  dialogOpen: boolean;
  year: number;
  month: number;
  profile: Profile;
}> = ({ handleDialogOpen, dialogOpen, year, month, profile }) => {
  const methods = useForm<RosterFormData>({
    defaultValues: {
      ...defaultValues,
      startDate: new Date(year, month),
      endDate: new Date(year, month),
    },
  });
  const { handleSubmit, reset } = methods;

  const disabledShiftTypes = profile.isAdmin ? [] : [ShiftType.X];
  const disabledShiftPriorities = profile.isAdmin
    ? []
    : [ShiftType.X, ShiftType.ANL];

  const handleCloseForm = () => {
    reset({
      ...defaultValues,
      startDate: new Date(year, month),
      endDate: new Date(year, month),
    });
    handleDialogOpen();
  };

  const handleSubmitRosterForm = (data: RosterFormData) => {
    const uid = 'jG4T6XMZu4X3Cs2sfgprpIvOfzz2';
    const id = uuidv4();

    // TODO: handle error
    set(ref(realtimeDatabase, 'days-off/' + id), {
      ...data,
      uid,
      startDate: format(data.startDate, 'yyyy-MM-dd'),
      endDate: format(data.endDate, 'yyyy-MM-dd'),
    });

    handleDialogOpen();
  };

  useEffect(() => {
    reset({
      ...defaultValues,
      startDate: new Date(year, month),
      endDate: new Date(year, month),
    });
  }, [year, month, reset]);

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
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(data => {
            console.log(data);
            handleDialogOpen();
          })}
        >
          <DialogTitle sx={{ p: 2 }}>Roster Form</DialogTitle>

          <Divider />

          <DialogContent
            className="roster-form_content"
            sx={{ width: '100%', mx: 'auto', p: 2 }}
          >
            <InputDatepicker label="Start Date" name="startDate" />

            <InputDatepicker label="End Date" name="endDate" />

            <InputSelect
              label="Type"
              name="type"
              disabledOptions={disabledShiftTypes}
              options={shiftTypeOptions}
            />

            <InputSelect
              label="Priority"
              name="priority"
              disabledOptions={disabledShiftPriorities}
              options={shiftPriorityOptions}
            />
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
            <Button variant="outlined" size="large" onClick={handleCloseForm}>
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
