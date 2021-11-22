import { FC } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

interface ConfirmDialogProps {
  isConfirmPending: boolean;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  isConfirmPending,
  open,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Dialog
      className="confirm-dialog"
      open={open}
      sx={{
        color: '#fff',
        zIndex: theme => theme.zIndex.drawer + 1,
        // backdropFilter: 'blur(3px)',
        '& .MuiDialog-paper': {
          m: 2,
          width: '100%',
          maxWidth: '400px',
        },
      }}
    >
      <DialogTitle sx={{ p: 2 }}>{title}</DialogTitle>
      <DialogContent sx={{ p: 2 }}>{message}</DialogContent>
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
          disabled={isConfirmPending}
          onClick={onClose}
          size="large"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          className={isConfirmPending ? '' : 'shadow'}
          color="error"
          disabled={isConfirmPending}
          onClick={onConfirm}
          size="large"
          variant="contained"
        >
          {isConfirmPending ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
