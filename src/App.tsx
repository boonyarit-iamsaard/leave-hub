import { FC } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// mui
import { Box } from '@mui/system';

// components
import Admin from './pages/Admin';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Roster from './pages/Roster';
import { Layout } from './components/Layout';

const App: FC = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/">
              <Profile />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/roster">
              <Roster />
            </Route>
            <Route path="/admin">
              <Admin />
            </Route>
          </Switch>
        </Layout>
      </BrowserRouter>
    </Box>
  );
};

export default App;
