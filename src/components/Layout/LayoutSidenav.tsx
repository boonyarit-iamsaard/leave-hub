import { FC } from 'react';

// mui
import { Drawer } from '@mui/material';
import { Box } from '@mui/system';

// components
import LayoutSidenavList from './LayoutSidenavList';

// types
import { LayoutProps } from './Layout';

const LayoutSidenav: FC<LayoutProps> = ({
  drawerWidth,
  drawerOpen,
  handleDrawerToggle,
}) => {
  return (
    <Box
      component="nav"
      sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        <LayoutSidenavList handleDrawerToggle={handleDrawerToggle} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        <LayoutSidenavList handleDrawerToggle={handleDrawerToggle} />
      </Drawer>
    </Box>
  );
};

export default LayoutSidenav;
