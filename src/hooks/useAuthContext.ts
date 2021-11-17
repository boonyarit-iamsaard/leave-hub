import { Dispatch, useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

// interfaces
import { AuthAction, AuthState } from '../interfaces/auth.interface';

export const useAuthContext = (): {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
} => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider');
  }

  return context;
};
