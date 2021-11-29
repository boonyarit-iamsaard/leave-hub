import { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// mui
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';

// interface
import { Profile } from '../../interfaces/auth.interface';

interface AdminUserListOptionsProps {
  params: GridRenderCellParams<Profile>;
  handleEditDialogOpen: (user: Profile) => void;
}

const AdminUserListOptions: FC<AdminUserListOptionsProps> = ({
  params,
  handleEditDialogOpen,
}) => {
  return (
    <div>
      <IconButton
        component={RouterLink}
        to={`/profile/${params.value.uid}`}
        target="_blank"
        aria-label="edit"
      >
        <PersonIcon />
      </IconButton>
      <IconButton
        onClick={() => handleEditDialogOpen(params.value)}
        aria-label="edit"
      >
        <EditIcon />
      </IconButton>
      <IconButton
        disabled
        onClick={() => alert(JSON.stringify(params.value, null, 2))}
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default AdminUserListOptions;
