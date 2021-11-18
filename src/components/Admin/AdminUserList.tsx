import { FC, useState } from 'react';

// mui
import { Card } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridSortModel,
} from '@mui/x-data-grid';

// interfaces
import { Profile } from '../../interfaces/auth.interface';
import AdminUserListOptions from './AdminUserListOptions';

interface AdminUserListProps {
  userList: Profile[];
  handleEditDialogOpen: (user: Profile) => void;
}

const AdminUserList: FC<AdminUserListProps> = ({
  userList,
  handleEditDialogOpen,
}) => {
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'firstName',
      sort: 'asc',
    },
  ]);

  const rows: GridRowsProp = userList.map(user => ({
    id: user.uid,
    firstName: user.firstName,
    lastName: user.lastName,
    entitled: user.entitled,
    options: user,
  }));

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
      renderCell: (params: GridRenderCellParams<Profile>) => {
        return (
          <AdminUserListOptions
            params={params}
            handleEditDialogOpen={handleEditDialogOpen}
          />
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <Card className="shadow">
          <DataGrid
            autoHeight
            columns={columns}
            onSortModelChange={model => setSortModel(model)}
            pageSize={10}
            rows={rows}
            rowsPerPageOptions={[10, 25, 50, 100]}
            sortModel={sortModel}
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminUserList;
