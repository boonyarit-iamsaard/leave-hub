import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { InputTextField } from '../Input';

import useResetPassword from '../../hooks/useResetPassword';

interface ResetPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const schema = yup
  .object({
    email: yup
      .string()
      .email('*Invalid email address.')
      .required('*Email is required.'),
  })
  .required();

const ResetPasswordDialog: FC<ResetPasswordDialogProps> = ({
  open,
  onClose,
}) => {
  const { isPending, error, resetPassword } = useResetPassword();
  const methods = useForm<{ email: string }>({
    defaultValues: { email: '' },
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const handleResetPassword = async (data: { email: string }) => {
    const isSuccess = await resetPassword(data.email);
    if (isSuccess) {
      reset({ email: '' });
      onClose();
    }
  };

  const handleClickCancel = () => {
    reset({ email: '' });
    onClose();
  };

  return (
    <Dialog
      className="reset-password-dialog"
      open={open}
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
    >
      {' '}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleResetPassword)}>
          <DialogTitle sx={{ p: 2 }}>Reset Password</DialogTitle>
          <DialogContent sx={{ p: 2 }}>
            Please provide your email address.
          </DialogContent>
          <DialogContent sx={{ px: 2, py: 0 }}>
            <InputTextField
              label="Email"
              name="email"
              error={errors && errors.email && errors.email.message}
            />
          </DialogContent>
          <DialogActions
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
            }}
          >
            <Button
              color="secondary"
              disabled={isPending}
              onClick={handleClickCancel}
              size="large"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              className={isPending ? '' : 'shadow'}
              color="error"
              disabled={isPending}
              size="large"
              type="submit"
              variant="contained"
            >
              Confirm
            </Button>
          </DialogActions>

          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ResetPasswordDialog;
