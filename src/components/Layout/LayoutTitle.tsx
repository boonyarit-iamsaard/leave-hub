import { FC } from 'react';

// mui
import { Box } from '@mui/system';

const LayoutTitle: FC = () => {
  return (
    <Box>
      <Box sx={{ color: 'text.secondary', fontWeight: 600 }}>Leave Hub</Box>

      <Box sx={{ fontSize: 10, display: { xs: 'none', sm: 'block' } }}>
        Bangkok Engineering
      </Box>
    </Box>
  );
};

export default LayoutTitle;
