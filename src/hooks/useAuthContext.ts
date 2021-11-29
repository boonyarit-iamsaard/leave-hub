import { Dispatch, useContext } from 'react';

// interfaces
import { AuthAction, AuthState } from '../interfaces/auth.interface';

// context
import { AuthContext } from '../context';

const useAuthContext = (): {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
} => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider');
  }

  return context;
};

export default useAuthContext;
