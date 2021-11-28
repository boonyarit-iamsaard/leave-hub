import { FC, useEffect, useState } from 'react';
import { differenceInDays, format } from 'date-fns';

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
import useShiftList from '../../hooks/useShiftList';

// interfaces
import { Shift } from '../../interfaces/roster.interface';

type ProfileShiftListProps = {
  selectedProfile: string | null;
};

const ProfileShiftList: FC<ProfileShiftListProps> = ({ selectedProfile }) => {
  const { shiftList } = useShiftList();
  const [filteredShiftList, setFilteredShiftList] = useState<Shift[]>(
    [] as Shift[]
  );
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'startDate',
      sort: 'asc',
    },
  ]);

  const rows: GridRowsProp = filteredShiftList.map(shift => {
    const { id, startDate, endDate, priority, status, type } = shift;
    const days = differenceInDays(endDate, startDate) + 1;

    return {
      id,
      startDate,
      endDate,
      days,
      priority,
      status,
      type,
    };
  });

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
      field: 'days',
      headerName: 'Days',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'type',
      headerName: 'Type',
      minWidth: 100,
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
  ];

  useEffect(() => {
    let filteredShiftList: Shift[] = [];
    if (selectedProfile) {
      filteredShiftList = shiftList.filter(shift => {
        return shift.uid === selectedProfile;
      });
    }

    setFilteredShiftList(filteredShiftList);
  }, [shiftList, selectedProfile]);

  return selectedProfile ? (
    <ProfileShiftListContainer className="profile-shift-list__container">
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
  ) : null;
};

export default ProfileShiftList;
