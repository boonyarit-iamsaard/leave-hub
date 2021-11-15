import { FC, ReactNode } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

// mui
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box } from '@mui/system';
import { LocalizationProvider } from '@mui/lab';

// components
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RosterPage from './pages/RosterPage';
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ height: '100vh' }}>
        {isAuthenticationReady && (
          <BrowserRouter>
            <Layout>
              <Switch>
                <ProtectedRoute exact={true} path="/">
                  <ProfilePage />
                </ProtectedRoute>

                <Route path="/login">
                  <LoginPage />
                </Route>

                <ProtectedRoute path="/roster">
                  <RosterPage />
                </ProtectedRoute>

                <ProtectedRoute path="/admin">
                  <AdminPage />
                </ProtectedRoute>
              </Switch>
            </Layout>
          </BrowserRouter>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default App;
