import { FC, ReactNode, useState } from 'react';

// mui
import { Box } from '@mui/system';
import { CssBaseline, Toolbar } from '@mui/material';

// components
import LayoutNavbar from './LayoutNavbar';
import LayoutSidenav from './LayoutSidenav';

// interfaces
export interface LayoutProps {
  drawerWidth: number;
  drawerOpen?: boolean;
  handleDrawerToggle: () => void;
}

const Layout: FC<ReactNode> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const drawerWidth = 240;

  const handleDrawerToggle = (): void => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {/* Navebar */}
      <LayoutNavbar
        drawerWidth={drawerWidth}
        drawerOpen={drawerOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <LayoutSidenav
        drawerWidth={drawerWidth}
        drawerOpen={drawerOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
          py: 2,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />

        {children}
      </Box>
    </Box>
  );
};

export default Layout;
