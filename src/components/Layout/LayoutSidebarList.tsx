import { FC } from 'react';

// mui
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import { Divider, List, Toolbar } from '@mui/material';
import { Box } from '@mui/system';

// components
import LayoutBrand from './LayoutBrand';
import LayoutSidebarListItemLink, {
  ListItemLinkProps,
} from './LayoutSidebarListItemLink';

// hooks
import useProfile from '../../hooks/useProfile';

const LayoutSidebarList: FC<{ handleDrawerToggle: () => void }> = ({
  handleDrawerToggle,
}) => {
  const { profile } = useProfile();
  const listItems: ListItemLinkProps[] = [
    {
      to: '/',
      primary: 'Home',
      icon: <HomeRoundedIcon />,
      onClick: handleDrawerToggle,
    },
    {
      to: '/roster',
      primary: 'Roster',
      icon: <TodayRoundedIcon />,
      onClick: handleDrawerToggle,
    },
  ];

  return (
    <div className="layout-sidebar_list">
      <Toolbar>
        <LayoutBrand />
      </Toolbar>

      <Box sx={{ px: 1, py: 2 }}>
        <List>
          {listItems.map(({ to, primary, icon, onClick }) => (
            <LayoutSidebarListItemLink
              key={to}
              to={to}
              primary={primary}
              icon={icon}
              onClick={onClick}
            />
          ))}

          <Divider sx={{ my: 1 }} />

          {profile.isAdmin && (
            <LayoutSidebarListItemLink
              to="/admin"
              primary="Admin"
              icon={<SupervisorAccountRoundedIcon />}
              onClick={handleDrawerToggle}
            />
          )}
        </List>
      </Box>
    </div>
  );
};

export default LayoutSidebarList;
