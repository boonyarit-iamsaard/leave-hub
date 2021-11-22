import { format, isSameMonth } from 'date-fns';
import { FC, useEffect, useState } from 'react';

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

import useShiftList from '../../hooks/useShiftList';
import useUserList from '../../hooks/useUserList';

import { RosterType, Shift } from '../../interfaces/roster.interface';
import { RosterShiftListOptions } from '.';

interface RosterShiftListProps {
  handleEditShift: (shift: Shift) => void;
  year: number;
  month: number;
  rosterType: RosterType;
}

const RosterShiftList: FC<RosterShiftListProps> = ({
  handleEditShift,
  year = 2022,
  month = 0,
  rosterType = RosterType.Mechanic,
}) => {
  const [filteredShiftList, setFilteredShiftList] = useState<Shift[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'startDate',
      sort: 'asc' as GridSortDirection,
    },
  ]);

  const { userList } = useUserList(rosterType);
  const { shiftList } = useShiftList();

  const getName = (uid: string) =>
    userList.find(user => user.uid === uid)?.firstName || 'N/A';

  const rows: GridRowsProp = filteredShiftList.map((shift: Shift) => ({
    id: shift.id,
    startDate: shift.startDate,
    endDate: shift.endDate,
    name: getName(shift.uid),
    type: shift.type,
    priority: shift.priority,
    status: shift.status,
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
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'options',
      headerName: 'Options',
      minWidth: 100,
      flex: 1,
      renderCell: (params: GridRenderCellParams<Shift>) => {
        return (
          <RosterShiftListOptions
            params={params}
            handleEditShift={handleEditShift}
          />
        );
      },
    },
  ];

  useEffect(() => {
    const filteredShiftList = shiftList.filter(shift => {
      const { startDate, endDate } = shift;

      const match =
        isSameMonth(startDate, new Date(year, month)) ||
        isSameMonth(endDate, new Date(year, month));

      return match;
    });

    setFilteredShiftList(filteredShiftList);
  }, [shiftList, month, year]);

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

export default RosterShiftList;
