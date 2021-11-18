import { FC } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';

interface AdminUserFormProps {
  handleDialogOpen: () => void;
  dialogOpen: boolean;
}

const AdminUserForm: FC<AdminUserFormProps> = ({
  handleDialogOpen,
  dialogOpen,
}) => {
  const handleCloseForm = () => {
    handleDialogOpen();
  };

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
      <DialogTitle sx={{ p: 2 }}>Add new user</DialogTitle>

      <Divider />

      <DialogContent
        className="admin-form_content"
        sx={{ width: '100%', mx: 'auto', p: 2 }}
      ></DialogContent>

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
    </Dialog>
  );
};

export default AdminUserForm;
