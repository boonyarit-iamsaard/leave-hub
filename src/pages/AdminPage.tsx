import { FC, useState } from 'react';

// mui
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/system';

// components
import { AdminUserForm, AdminUserList } from '../components/Admin';

// hooks
import useUserList from '../hooks/useUserList';

// interfaces
import { Profile } from '../interfaces/auth.interface';

const AdminPageHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const AdminPage: FC = () => {
  const { userList } = useUserList();
  const [user, setUser] = useState<Profile>({} as Profile);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleEditDialogOpen = (user: Profile) => {
    setEditMode(true);
    setUser(user);
    handleDialogOpen();
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

      <AdminUserList
        handleEditDialogOpen={handleEditDialogOpen}
        userList={userList}
      />

      <AdminUserForm
        dialogOpen={dialogOpen}
        handleDialogOpen={handleDialogOpen}
        user={editMode ? user : undefined}
      />
    </div>
  );
};

export default AdminPage;
