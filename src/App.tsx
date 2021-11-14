import { FC, ReactNode } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

// mui
import { Box } from '@mui/system';

// components
import Admin from './pages/Admin';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Roster from './pages/Roster';
import { Layout } from './components/Layout';

// context
import { useAuthContext } from './hooks/useAuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  exact?: boolean;
  path: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, ...rest }) => {
  const {
    state: { user },
  } = useAuthContext();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

const App: FC = () => {
  const {
    state: { isAuthenticationReady },
  } = useAuthContext();

  return (
    <Box sx={{ height: '100vh' }}>
      {isAuthenticationReady && (
        <BrowserRouter>
          <Layout>
            <Switch>
              <ProtectedRoute exact={true} path="/">
                <Profile />
              </ProtectedRoute>

              <Route path="/login">
                <Login />
              </Route>

              <ProtectedRoute path="/roster">
                <Roster />
              </ProtectedRoute>

              <ProtectedRoute path="/admin">
                <Admin />
              </ProtectedRoute>
            </Switch>
          </Layout>
        </BrowserRouter>
      )}
    </Box>
  );
};

export default App;
