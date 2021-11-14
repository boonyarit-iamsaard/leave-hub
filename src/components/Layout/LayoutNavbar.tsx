import { FC } from 'react';

// mui
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';

// interfaces
import { LayoutProps } from './Layout';

// components
import LayoutTitle from './LayoutTitle';

// hooks
// custom hooks
import useLogout from '../../hooks/useLogout';

const LayoutNavbar: FC<LayoutProps> = ({ drawerWidth, handleDrawerToggle }) => {
  const { logout } = useLogout();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('lg'));

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'white',
        color: 'text.primary',
        width: { lg: `calc(100% - ${drawerWidth}px)` },
        ml: { lg: `${drawerWidth}px` },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {!matches && <LayoutTitle />}
        </Box>

        <Box>
          <Button onClick={handleLogout} sx={{ color: 'text.secondary' }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LayoutNavbar;
