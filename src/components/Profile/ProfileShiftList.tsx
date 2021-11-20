import { FC, useEffect, useState } from 'react';

// mui
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridSortModel,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { Card } from '@mui/material';

// styled-components
import { ProfileShiftListContainer } from './ProfileShiftList.style';

// hooks
import useProfile from '../../hooks/useProfile';
import useShiftList from '../../hooks/useShiftList';

// interfaces
import { Shift } from '../../interfaces/roster.interface';
import { format } from 'date-fns';

const ProfileShiftList: FC = () => {
  const { profile } = useProfile();
  const { shiftList } = useShiftList();
  const [filteredShiftList, setFilteredShiftList] = useState<Shift[]>(
    [] as Shift[]
  );
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'startDate',
      sort: 'desc',
    },
  ]);

  const rows: GridRowsProp = filteredShiftList.map(shift => {
    const { id, startDate, endDate, priority, status, type } = shift;

    return {
      id,
      startDate,
      endDate,
      priority,
      status,
      type,
    };
  });

  const columns: GridColDef[] = [
    {
      field: 'startDate',
      headerName: 'From',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        params.value && (params.value as Date)
          ? format(params.value as Date, 'yyyy-MM-dd')
          : 'N/A',
    },
    {
      field: 'endDate',
      headerName: 'To',
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        params.value && (params.value as Date)
          ? format(params.value as Date, 'yyyy-MM-dd')
          : 'N/A',
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
  ];

  useEffect(() => {
    const filteredShiftList = shiftList.filter(shift => {
      return shift.uid === profile.uid;
    });

    setFilteredShiftList(filteredShiftList);
  }, [shiftList, profile.uid]);

  return (
    <ProfileShiftListContainer className="profile-shifter-list__container">
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
    </ProfileShiftListContainer>
  );
};

export default ProfileShiftList;
