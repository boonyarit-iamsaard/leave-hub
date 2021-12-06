import { FC } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

// mui
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box } from '@mui/system';
import { LocalizationProvider } from '@mui/lab';

// components
import LoginPage from '../../pages/LoginPage';
import ProfilePage from '../../pages/ProfilePage';
import RosterPage from '../../pages/RosterPage';
import { Admin, AdminShiftList } from '../../features/admin';
import { Layout } from '../Layout';

// hooks
import useAuthContext from '../../hooks/useAuthContext';
import useProfile from '../../hooks/useProfile';

const App: FC = () => {
  const {
    state: { isAuthenticationReady, user },
  } = useAuthContext();
  const { profile } = useProfile();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="app" sx={{ height: '100vh' }}>
        {isAuthenticationReady && (
          <BrowserRouter>
            <Layout>
              <Switch>
                <Route exact path="/">
                  {!user ? <Redirect to="/login" /> : <ProfilePage />}
                </Route>
                <Route exact path="/admin/users">
                  {!user && <Redirect to="/login" />}
                  {user && profile.isAdmin && <Admin />}
                  {user && !profile.isAdmin && <Redirect exact to="/" />}
                </Route>
                <Route path="/admin/pending">
                  {!user && <Redirect to="/login" />}
                  {user && profile.isAdmin && <AdminShiftList />}
                  {user && !profile.isAdmin && <Redirect exact to="/" />}
                </Route>
                <Route path="/login">
                  {user ? <Redirect exact to="/" /> : <LoginPage />}
                </Route>
                <Route path="/profile/:uid">
                  {!user ? <Redirect to="/login" /> : <ProfilePage />}
                </Route>
                <Route path="/roster">
                  {!user ? <Redirect to="/login" /> : <RosterPage />}
                </Route>
              </Switch>
            </Layout>
          </BrowserRouter>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default App;
