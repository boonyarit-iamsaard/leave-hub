import { FC, useState } from 'react';

// mui
import { Card } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridSortDirection,
  GridSortModel,
} from '@mui/x-data-grid';

// interfaces
import { Profile } from '../../interfaces/auth.interface';
import { RosterType } from '../../interfaces/roster.interface';

// components
import AdminUserListOptions from './AdminUserListOptions';
import AdminUserListUsed from './AdminUserListUsed';

// hooks
import useAdminSummary from '../../hooks/useAdminSummary';

interface AdminUserListProps {
  handleEditDialogOpen: (user: Profile) => void;
  rosterType: RosterType;
}

const AdminUserList: FC<AdminUserListProps> = ({
  handleEditDialogOpen,
  rosterType = RosterType.Mechanic,
}) => {
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'firstName',
      sort: 'asc' as GridSortDirection,
    },
  ]);
  const { adminSummary } = useAdminSummary(rosterType);

  const rows: GridRowsProp = adminSummary.map(summary => ({
    id: summary.user.uid,
    firstName: summary.user.firstName,
    lastName: summary.user.lastName,
    entitled: summary.user.entitled,
    used: summary.total,
    tyc: summary.user.tyc,
    carryover: summary.user.carryover || 0,
    options: summary.user,
  }));

  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'entitled',
      headerName: 'Entitled',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'used',
      headerName: 'Used',
      minWidth: 100,
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
      field: 'tyc',
      headerName: 'TYC',
      minWidth: 80,
      flex: 1,
    },
    {
      field: 'carryover',
      headerName: 'Carryover',
      minWidth: 80,
      flex: 1,
    },
    {
      field: 'options',
      headerName: 'Options',
      minWidth: 100,
      flex: 1,
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
            onPageSizeChange={pageSize => setPageSize(pageSize)}
            onSortModelChange={model => setSortModel(model)}
            pageSize={pageSize}
            pagination
            rows={rows}
            rowsPerPageOptions={[10, 20, 50, 100]}
            sortModel={sortModel}
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminUserList;
