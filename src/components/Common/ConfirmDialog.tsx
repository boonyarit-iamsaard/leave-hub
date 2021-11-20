import { FC } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
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
          onClick={onClose}
          size="large"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          className="shadow"
          color="error"
          onClick={onConfirm}
          size="large"
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
