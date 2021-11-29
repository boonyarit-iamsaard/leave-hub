import { FC } from 'react';
import { Redirect, Route } from 'react-router';

import useAuthContext from '../../../../../hooks/useAuthContext';
import useProfile from '../../../../../hooks/useProfile';

type AppRouteProps = {
  component: FC;
  exact?: boolean;
  path: string;
};

const AppRoute: FC<AppRouteProps> = ({
  component: Component,
  exact = false,
  path,
}) => {
  const {
    state: { user },
  } = useAuthContext();
  const { profile } = useProfile();

  const loginRoute = path === '/login';
  const adminRoute = path === '/admin';
  const isAuthenticated = !!user && !!profile;
  const isAdmin = profile && profile.isAdmin;

  return (
    <Route
      exact={exact}
      path={path}
      render={({ location }) => {
        if (isAuthenticated) {
          if (isAdmin)
            return loginRoute ? (
              <Redirect exact to={{ pathname: '/' }} />
            ) : (
              <Component />
            );

          if (!isAdmin && adminRoute)
            return <Redirect exact to={{ pathname: '/' }} />;

          return loginRoute ? (
            <Redirect exact to={{ pathname: '/' }} />
          ) : (
            <Component />
          );
        }

        return path === '/login' ? (
          <Component />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        );
      }}
    />
  );
};

export default AppRoute;
