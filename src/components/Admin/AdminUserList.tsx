import { FC } from 'react';

// mui
import { Card } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from '@mui/x-data-grid';

// interfaces
import { Profile } from '../../interfaces/auth.interface';
import { RosterType } from '../../interfaces/roster.interface';

// components
import AdminUserListOptions from './AdminUserListOptions';

// hooks
import useAdminSummary from '../../hooks/useAdminSummary';
import AdminUserListUsed from './AdminUserListUsed';

interface AdminUserListProps {
  handleEditDialogOpen: (user: Profile) => void;
  rosterType: RosterType;
}

const AdminUserList: FC<AdminUserListProps> = ({
  handleEditDialogOpen,
  rosterType = RosterType.Mechanic,
}) => {
  const { adminSummary } = useAdminSummary(rosterType);

  const rows: GridRowsProp = adminSummary.map(summary => ({
    id: summary.user.uid,
    firstName: summary.user.firstName,
    lastName: summary.user.lastName,
    entitled: summary.user.entitled,
    used: summary.total,
    options: summary.user,
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
      field: 'used',
      headerName: 'Used',
      flex: 1,
      renderCell: params => {
        const entitled = params.getValue(params.id, 'entitled');
        const used = params.value;
        const percentage = Math.round(
          entitled && (entitled as number)
            ? (used / (entitled as number)) * 100
            : 0
        ).toFixed(2);

        return <AdminUserListUsed used={used} percentage={percentage} />;
      },
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
        <Card className="shadow" sx={{ mb: 2 }}>
          <DataGrid
            autoHeight
            columns={columns}
            pageSize={10}
            rows={rows}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminUserList;
