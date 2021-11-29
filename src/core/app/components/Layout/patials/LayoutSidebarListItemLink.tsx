import { FC, forwardRef, ReactElement, useMemo } from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

export type ListItemLinkProps = {
  icon?: ReactElement;
  primary: string;
  to: string;
  onClick: () => void;
};

const LayoutSidebarListItemLink: FC<ListItemLinkProps> = ({
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
    <li className="layout-sidebar__list">
      <ListItem button component={renderLink} onClick={onClick}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
};

export default LayoutSidebarListItemLink;
