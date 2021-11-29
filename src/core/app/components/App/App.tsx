import { FC } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

// mui
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box } from '@mui/system';
import { LocalizationProvider } from '@mui/lab';

// components
import { AppRoute } from './patials';
import { Layout } from '../Layout';

// context
import useAuthContext from '../../../../hooks/useAuthContext';

// configs
import routes from '../../routes';

const App: FC = () => {
  const {
    state: { isAuthenticationReady },
  } = useAuthContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="app" sx={{ height: '100vh' }}>
        {isAuthenticationReady && (
          <BrowserRouter>
            <Layout>
              <Switch>
                {routes.map(({ component, exact, path }) => (
                  <AppRoute
                    component={component}
                    exact={exact}
                    key={path}
                    path={path}
                  />
                ))}
              </Switch>
            </Layout>
          </BrowserRouter>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default App;
