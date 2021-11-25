import { FC } from 'react';

import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RosterPage from './pages/RosterPage';

interface Route {
  path: string;
  component: FC;
  exact?: boolean;
  isAdminRequired: boolean;
  isAuthenticatedRequired: boolean;
}

const routes: Route[] = [
  {
    exact: true,
    path: '/',
    component: ProfilePage,
    isAuthenticatedRequired: true,
    isAdminRequired: false,
  },
  {
    path: '/profile',
    component: ProfilePage,
    isAuthenticatedRequired: true,
    isAdminRequired: false,
  },
  {
    path: '/roster',
    component: RosterPage,
    isAuthenticatedRequired: true,
    isAdminRequired: false,
  },
  {
    path: '/admin',
    component: AdminPage,
    isAuthenticatedRequired: true,
    isAdminRequired: true,
  },
  {
    path: '/login',
    component: LoginPage,
    isAuthenticatedRequired: false,
    isAdminRequired: false,
  },
];

export default routes;
