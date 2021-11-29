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
      <Typography
        color={Number(percentage) >= 50 ? 'grey.400' : 'error'}
        variant="caption"
      >
        ({percentage} %)
      </Typography>
    </Box>
  );
};

export default AdminUserListUsed;
