import { FC } from 'react';

import logo from '../../../../../assets/images/logo.png';

// mui
import { Box } from '@mui/system';

const LayoutBrand: FC = () => {
  return (
    <Box
      className="layout-brand"
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      <img alt="Company Logo" src={logo} width="32" height="32" />
      <Box sx={{ ml: 2, display: { xs: 'none', sm: 'block' } }}>
        <Box sx={{ color: 'text.secondary', fontWeight: 600 }}>Leave Hub</Box>
        <Box sx={{ fontSize: 10 }}>Bangkok Engineering</Box>
      </Box>
    </Box>
  );
};

export default LayoutBrand;
