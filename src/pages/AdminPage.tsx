import { FC, useState } from 'react';

// mui
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/system';

// components
import { AdminUserForm, AdminUserList } from '../components/Admin';

import useUserList from '../hooks/useUserList';

const AdminPageHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const AdminPage: FC = () => {
  const { userList } = useUserList();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
  };

  return (
    <div>
      <AdminPageHeader style={{ marginBottom: 16 }}>
        <Typography variant="h6">Admin</Typography>

        <Button
          className="shadow"
          variant="contained"
          color="primary"
          onClick={handleDialogOpen}
        >
          Add User
        </Button>
      </AdminPageHeader>

      <AdminUserList userList={userList} />

      <AdminUserForm
        dialogOpen={dialogOpen}
        handleDialogOpen={handleDialogOpen}
      />
    </div>
  );
};

export default AdminPage;
