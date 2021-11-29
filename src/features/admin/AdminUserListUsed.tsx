import { FC } from 'react';

import { Box } from '@mui/system';
import { Typography } from '@mui/material';

interface AdminUserListUsedProps {
  used: number;
  percentage: string;
}

const AdminUserListUsed: FC<AdminUserListUsedProps> = ({
  used,
  percentage,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography sx={{ mr: 1 }} variant="body1">
        {used}
      </Typography>
      <Typography color="grey.400" variant="caption">
        ({percentage} %)
      </Typography>
    </Box>
  );
};

export default AdminUserListUsed;
