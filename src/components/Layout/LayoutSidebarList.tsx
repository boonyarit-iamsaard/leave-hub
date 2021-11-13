import { FC, forwardRef, Fragment, ReactElement, useMemo } from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

// mui
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { Box } from '@mui/system';

// components
import LayoutTitle from './LayoutTitle';

// interfaces
interface ListItemLinkProps {
  icon?: ReactElement;
  primary: string;
  to: string;
  onClick: () => void;
}

const ListItemLink: FC<ListItemLinkProps> = ({
  icon,
  primary,
  to,
  onClick,
}) => {
  const renderLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>(function Link(
        itemProps,
        ref
      ) {
        return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
      }),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink} onClick={onClick}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
};

const LayoutSidebarList: FC<{ handleDrawerToggle: () => void }> = ({
  handleDrawerToggle,
}) => {
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
    <Fragment>
      <Toolbar>
        <LayoutTitle />
      </Toolbar>

      <Box sx={{ px: 1, py: 2 }}>
        <List>
          {listItems.map(item => (
            <ListItemLink
              key={item.to}
              to={item.to}
              primary={item.primary}
              icon={item.icon}
              onClick={item.onClick}
            />
          ))}

          <Divider sx={{ my: 1 }} />

          <ListItemLink
            to="/admin"
            primary="Admin"
            icon={<SupervisorAccountRoundedIcon />}
            onClick={handleDrawerToggle}
          />
        </List>
      </Box>
    </Fragment>
  );
};

export default LayoutSidebarList;
