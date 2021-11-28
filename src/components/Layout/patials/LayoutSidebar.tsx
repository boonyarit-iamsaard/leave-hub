import { FC } from 'react';

// mui
import { Drawer } from '@mui/material';
import { Box } from '@mui/system';

// components
import LayoutSidebarList from './LayoutSidebarList';

// types
import { LayoutProps } from '../Layout';

const LayoutSidebar: FC<LayoutProps> = ({
  drawerWidth,
  drawerOpen,
  handleDrawerToggle,
}) => {
  return (
    <Box
      className="layout-sidebar"
      component="nav"
      sx={{ width: { xl: drawerWidth }, flexShrink: { xl: 0 } }}
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
          display: { xs: 'block', xl: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        <LayoutSidebarList handleDrawerToggle={handleDrawerToggle} />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', xl: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        <LayoutSidebarList handleDrawerToggle={handleDrawerToggle} />
      </Drawer>
    </Box>
  );
};

export default LayoutSidebar;
