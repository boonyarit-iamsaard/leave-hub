import { FC } from 'react';

// mui
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Card, IconButton } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from '@mui/x-data-grid';

// interfaces
import { Profile } from '../../interfaces/auth.interface';

interface AdminUserListProps {
  userList: Profile[];
}

const columns: GridColDef[] = [
  {
    field: 'firstName',
    headerName: 'First Name',
    flex: 1,
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
    flex: 1,
  },
  {
    field: 'entitled',
    headerName: 'Entitled',
    flex: 1,
  },
  {
    field: 'options',
    headerName: 'Options',
    width: 150,
    renderCell: (params: GridRenderCellParams<string>) => {
      return (
        <div>
          <IconButton
            onClick={() => alert(JSON.stringify(params.value, null, 2))}
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => alert(JSON.stringify(params.value, null, 2))}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      );
    },
  },
];

const AdminUserList: FC<AdminUserListProps> = ({ userList }) => {
  const rows: GridRowsProp = userList.map(user => ({
    id: user.uid,
    firstName: user.firstName,
    lastName: user.lastName,
    entitled: user.entitled,
    options: user,
  }));

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <Card className="shadow">
          <DataGrid
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50, 100]}
            rows={rows}
            columns={columns}
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminUserList;
