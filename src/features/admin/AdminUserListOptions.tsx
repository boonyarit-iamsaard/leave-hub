import { FC } from 'react';

// mui
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
