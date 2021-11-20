import { FC } from 'react';

import logo from '../../assets/images/logo.png';

// mui
import { Box } from '@mui/system';

const LayoutTitle: FC = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <img alt="Company Logo" src={logo} width="32" height="32" />

      <Box sx={{ ml: 2 }}>
        <Box sx={{ color: 'text.secondary', fontWeight: 600 }}>Leave Hub</Box>
        <Box sx={{ fontSize: 10, display: { xs: 'none', sm: 'block' } }}>
          Bangkok Engineering
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutTitle;
