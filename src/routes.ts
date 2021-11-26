import { FC } from 'react';

import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RosterPage from './pages/RosterPage';

type AppRoute = {
  path: string;
  component: FC;
  exact?: boolean;
};

const routes: AppRoute[] = [
  {
    exact: true,
    path: '/',
    component: ProfilePage,
  },
  {
    path: '/profile',
    component: ProfilePage,
  },
  {
    path: '/roster',
    component: RosterPage,
  },
  {
    path: '/admin',
    component: AdminPage,
  },
  {
    path: '/login',
    component: LoginPage,
  },
];

export default routes;
