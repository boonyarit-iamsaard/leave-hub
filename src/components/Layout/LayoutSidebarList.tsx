import { FC, Fragment, useState } from 'react';

// mui
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import SettingsIcon from '@mui/icons-material/Settings';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import { Box } from '@mui/system';
import {
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';

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
  const [open, setOpen] = useState(false);
  const { profile } = useProfile();

  const handleClickExpand = () => setOpen(!open);

  const handleClickItem = () => {
    handleClickExpand();
    handleDrawerToggle();
  };

  const listItems: ListItemLinkProps[] = [
    {
      to: '/',
      primary: 'Home',
      icon: <HomeRoundedIcon />,
      onClick: handleClickItem,
    },
    {
      to: '/roster',
      primary: 'Roster',
      icon: <TodayRoundedIcon />,
      onClick: handleClickItem,
    },
  ];

  const listItemsAdmin: ListItemLinkProps[] = [
    {
      to: '/admin/users',
      primary: 'Users',
      icon: <SupervisorAccountRoundedIcon />,
      onClick: handleClickItem,
    },
    {
      to: '/admin/pending',
      primary: 'Pending',
      icon: <PriorityHighIcon />,
      onClick: handleClickItem,
    },
    {
      to: '/admin/settings',
      primary: 'Settings',
      icon: <SettingsIcon />,
      onClick: handleClickItem,
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
          {profile.isAdmin && <Divider sx={{ my: 1 }} />}
          {profile.isAdmin && (
            <Fragment>
              <ListItemButton onClick={handleClickExpand}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Admin" />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {listItemsAdmin.map(({ to, primary, icon, onClick }) => (
                    <LayoutSidebarListItemLink
                      icon={icon}
                      key={to}
                      onClick={onClick}
                      primary={primary}
                      style={{ paddingLeft: '2rem' }}
                      to={to}
                    />
                  ))}
                </List>
              </Collapse>
            </Fragment>
          )}
        </List>
      </Box>
    </div>
  );
};

export default LayoutSidebarList;
