import { FC, useState } from 'react';
import { format } from 'date-fns';

import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridSortDirection,
  GridSortModel,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { Card } from '@mui/material';

// hooks
import useUserList from '../../hooks/useUserList';

// types
import { Profile } from '../../interfaces/auth.interface';
import { Shift } from '../../interfaces/roster.interface';

// components
import { ShiftForm, ShiftFormMode, ShiftListOptions } from '.';

// styled-components
import { ShiftListContainer } from './ShiftList.style';

// utils
import { transformTimestamp } from '../../utils/transform-timestamp';
import { getProfile } from '../../utils';

interface ShiftListProps {
  filteredShiftList: Shift[];
}

const RosterShiftList: FC<ShiftListProps> = ({ filteredShiftList }) => {
  const [pageSize, setPageSize] = useState(10);
  const [shiftForm, setShiftForm] = useState({
    mode: ShiftFormMode.EDIT,
    open: false,
    selectedProfile: {} as Profile,
    shift: {} as Shift,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'startDate',
      sort: 'asc' as GridSortDirection,
    },
    {
      field: 'createdAt',
      sort: 'asc' as GridSortDirection,
    },
  ]);
  const { userList } = useUserList();

  const getName = (uid: string) =>
    userList.find(user => user.uid === uid)?.firstName || 'N/A';

  const handleShiftFormOpen = (shift: Shift) => {
    setShiftForm({
      ...shiftForm,
      open: true,
      selectedProfile: getProfile(shift.uid, userList),
      shift,
    });
  };

  const handleShiftFormClose = () => {
    setShiftForm({
      ...shiftForm,
      open: false,
    });
  };

  const rows: GridRowsProp = filteredShiftList.map((shift: Shift) => ({
    id: shift.id,
    startDate: shift.startDate,
    endDate: shift.endDate,
    name: getName(shift.uid),
    type: shift.type,
    priority: shift.priority,
    status: shift.status,
    createdAt: transformTimestamp(shift.createdAt as number),
    options: shift,
  }));

  const columns: GridColDef[] = [
    {
      field: 'startDate',
      headerName: 'From',
      minWidth: 120,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        params.value && (params.value as Date)
          ? format(params.value as Date, 'yyyy-MM-dd')
          : 'N/A',
    },
    {
      field: 'endDate',
      headerName: 'To',
      minWidth: 120,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        params.value && (params.value as Date)
          ? format(params.value as Date, 'yyyy-MM-dd')
          : 'N/A',
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'type',
      headerName: 'Type',
      minWidth: 80,
      flex: 1,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      minWidth: 80,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 90,
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      minWidth: 140,
      flex: 1,
    },
    {
      field: 'options',
      headerName: 'Options',
      minWidth: 100,
      flex: 1,
      renderCell: (params: GridRenderCellParams<Shift>) => {
        return (
          <ShiftListOptions
            params={params}
            handleClickEdit={handleShiftFormOpen}
          />
        );
      },
    },
  ];

  return (
    <ShiftListContainer className="shift-list__container">
      <ShiftForm handleClose={handleShiftFormClose} {...shiftForm} />
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
    </ShiftListContainer>
  );
};

export default RosterShiftList;
