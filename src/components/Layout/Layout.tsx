import { FC, ReactNode, useState } from 'react';

// mui
import { Box } from '@mui/system';
import { CssBaseline, Toolbar, useTheme } from '@mui/material';

// components

// context
import useAuthContext from '../../hooks/useAuthContext';
import useProfile from '../../hooks/useProfile';
import LayoutNavbar from './LayoutNavbar';
import LayoutSidebar from './LayoutSidebar';

// interfaces
export type LayoutProps = {
  drawerWidth: number;
  drawerOpen?: boolean;
  handleDrawerToggle: () => void;
};

const Layout: FC<ReactNode> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const drawerWidth = 240;
  const theme = useTheme();
  const {
    state: { user },
  } = useAuthContext();
  const { profile } = useProfile();
  const isAuthenticated = !!user && !!profile;

  const handleDrawerToggle = (): void => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box
      className="layout"
      sx={{ display: 'flex', flexShrink: 0, minHeight: '100%' }}
    >
      <CssBaseline />
      {isAuthenticated ? (
        <LayoutNavbar
          drawerWidth={drawerWidth}
          drawerOpen={drawerOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
      ) : null}
      {isAuthenticated ? (
        <LayoutSidebar
          drawerWidth={drawerWidth}
          drawerOpen={drawerOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
      ) : null}
      <Box
        className="layout-content"
        component="main"
        sx={{
          background: theme.palette.grey['100'],
          flexGrow: 1,
          p: 2,
          width: {
            xs: '100%',
            xl: `calc(100% - ${drawerWidth}px)`,
          },
        }}
      >
        {isAuthenticated ? <Toolbar /> : null}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
