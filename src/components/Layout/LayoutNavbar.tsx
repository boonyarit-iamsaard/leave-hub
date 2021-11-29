import { FC } from 'react';

// mui
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';

// types
import { LayoutProps } from './Layout';

// components
import LayoutBrand from './LayoutBrand';
import LayoutNavbarNotification from './LayoutNavbarNotification';

// custom hooks
import useLogout from '../../hooks/useLogout';
import useProfile from '../../hooks/useProfile';

const LayoutNavbar: FC<LayoutProps> = ({ drawerWidth, handleDrawerToggle }) => {
  const { logout } = useLogout();
  const { profile } = useProfile();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('lg'));

  const handleLogout = async () => {
    await logout();
  };

  return (
    <AppBar
      className="layout-navbar"
      position="fixed"
      elevation={0}
      sx={{
        background: 'white',
        color: 'text.primary',
        width: { xl: `calc(100% - ${drawerWidth}px)` },
        ml: { xl: `${drawerWidth}px` },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { xl: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {!matches && <LayoutBrand />}
        </Box>

        {profile && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}
              variant="body2"
            >
              {profile.firstName} {profile.lastName}
            </Typography>

            {profile.isAdmin && <LayoutNavbarNotification />}

            <Box>
              <Button
                color="secondary"
                onClick={handleLogout}
                sx={{ color: 'text.secondary' }}
                variant="outlined"
              >
                Logout
              </Button>
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default LayoutNavbar;
