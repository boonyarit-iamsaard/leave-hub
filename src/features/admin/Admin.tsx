import { FC, useState } from 'react';

// mui
import { Button, Typography } from '@mui/material';

// interfaces
import { Profile } from '../../interfaces/auth.interface';
import { RosterType } from '../../interfaces/roster.interface';

// components
import AdminUserList from './AdminUserList';
import AdminUserForm from './AdminUserForm';

// styled-components
import { AdminContainer, AdminHeader } from './Admin.style';

const Admin: FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [rosterType, setRosterType] = useState<RosterType>(RosterType.Engineer);
  const [user, setUser] = useState<Profile>({} as Profile);

  const handleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleEditDialogOpen = (user: Profile) => {
    setEditMode(true);
    setUser(user);
    handleDialogOpen();
  };

  const handleSwitchRosterType = (type: RosterType) => {
    setRosterType(type);
  };

  return (
    <AdminContainer>
      <AdminHeader>
        <Typography variant="h6">Admin</Typography>
        <div>
          <Button
            color="primary"
            disabled={rosterType === RosterType.Engineer}
            onClick={() => handleSwitchRosterType(RosterType.Engineer)}
            sx={{ mr: 2 }}
            variant="outlined"
          >
            Engineer
          </Button>
          <Button
            color="primary"
            disabled={rosterType === RosterType.Mechanic}
            onClick={() => handleSwitchRosterType(RosterType.Mechanic)}
            sx={{ mr: 2 }}
            variant="outlined"
          >
            Mechanic
          </Button>
          <Button
            className="shadow"
            variant="contained"
            color="primary"
            onClick={handleDialogOpen}
          >
            Add User
          </Button>
        </div>
      </AdminHeader>
      {rosterType === RosterType.Engineer && (
        <AdminUserList
          handleEditDialogOpen={handleEditDialogOpen}
          rosterType={RosterType.Engineer}
        />
      )}
      {rosterType === RosterType.Mechanic && (
        <AdminUserList
          handleEditDialogOpen={handleEditDialogOpen}
          rosterType={RosterType.Mechanic}
        />
      )}
      <AdminUserForm
        dialogOpen={dialogOpen}
        handleDialogOpen={handleDialogOpen}
        user={editMode ? user : undefined}
      />
    </AdminContainer>
  );
};

export default Admin;
