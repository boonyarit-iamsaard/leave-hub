import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import useShiftList from '../../hooks/useShiftList';

import { Shift, ShiftStatus } from '../../interfaces/roster.interface';

import { ShiftList } from '../../components/Shift';
import { Box, Typography } from '@mui/material';

const AdminShiftList: FC = () => {
  const [filteredShiftList, setFilteredShiftList] = useState<Shift[]>([]);
  const location = useLocation();
  const { shiftList } = useShiftList();

  useEffect(() => {
    if (location.pathname === '/admin/pending') {
      setFilteredShiftList(
        shiftList.filter(shift => shift.status === ShiftStatus.Pending)
      );
    } else setFilteredShiftList(shiftList);
  }, [location.pathname, shiftList]);

  return (
    <div>
      <Box
        sx={{
          px: 2,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">Pending</Typography>
      </Box>
      <ShiftList filteredShiftList={filteredShiftList} />
    </div>
  );
};

export default AdminShiftList;
