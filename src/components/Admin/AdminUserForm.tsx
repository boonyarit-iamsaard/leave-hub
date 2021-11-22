import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// mui
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';

// components
import { InputCheckbox, InputSelect, InputTextField } from '../Input';

// hooks
import useUserList from '../../hooks/useUserList';

// interfaces
import { RosterType } from '../../interfaces/roster.interface';
import { Profile } from '../../interfaces/auth.interface';

interface AdminUserFormProps {
  handleDialogOpen: () => void;
  dialogOpen: boolean;
  user?: Profile;
}

const defaultValues: Profile = {
  uid: '',
  firstName: '',
  lastName: '',
  isAdmin: false,
  roster: RosterType.Mechanic,
  entitled: 0,
  tyc: 0,
  carryover: 0,
};
const rosterTypeOptions = [
  { value: RosterType.Mechanic, label: 'Mechanic' },
  { value: RosterType.Engineer, label: 'Engineer' },
];

const AdminUserForm: FC<AdminUserFormProps> = ({
  handleDialogOpen,
  dialogOpen,
  user,
}) => {
  const { setUserDocument, loading } = useUserList();
  const methods = useForm<Profile>({
    defaultValues: { ...defaultValues },
  });
  const { handleSubmit, reset } = methods;

  const handleCloseForm = () => {
    reset({
      uid: '',
      firstName: '',
      lastName: '',
      isAdmin: false,
      roster: RosterType.Mechanic,
      entitled: 0,
      tyc: 0,
      carryover: 0,
    });
    handleDialogOpen();
  };

  const handleSubmitAdminUserForm = async (data: Profile) => {
    await setUserDocument({
      ...data,
      tyc: Number(data.tyc),
      entitled: Number(data.entitled),
      carryover: Number(data.carryover),
    }).then(() => {
      handleCloseForm();
    });
  };

  useEffect(() => {
    if (user) {
      reset({ ...user, carryover: user.carryover || 0 });
    } else
      reset({
        uid: '',
        firstName: '',
        lastName: '',
        isAdmin: false,
        roster: RosterType.Mechanic,
        entitled: 0,
        tyc: 0,
        carryover: 0,
      });
  }, [reset, user]);

  return (
    <Dialog
      className="admin-form"
      sx={{
        color: '#fff',
        zIndex: theme => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(3px)',
        '& .MuiDialog-paper': {
          m: 2,
          width: '100%',
          maxWidth: '600px',
        },
      }}
      open={dialogOpen}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitAdminUserForm)}>
          <DialogTitle sx={{ p: 2 }}>User Form</DialogTitle>

          <Divider />

          <DialogContent
            className="admin-form_content"
            sx={{ width: '100%', mx: 'auto', p: 2 }}
          >
            <InputTextField name="uid" label="UID" />

            <InputTextField name="firstName" label="First Name" />

            <InputTextField name="lastName" label="Last Name" />

            <InputCheckbox name="isAdmin" label="Admin" />

            <InputSelect
              name="roster"
              label="Roster"
              options={rosterTypeOptions}
            />

            <InputTextField name="entitled" label="Entitled" type="number" />

            <InputTextField name="tyc" label="TYC Entitled" type="number" />

            <InputTextField name="carryover" label="Carryover?" type="number" />
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
            <Button
              disabled={loading}
              variant="outlined"
              size="large"
              onClick={handleCloseForm}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              className={loading ? '' : 'shadow'}
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

export default AdminUserForm;
