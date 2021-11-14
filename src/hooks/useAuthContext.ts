import { Dispatch, useContext } from 'react';

import { AuthContext, IAuthAction } from '../context/AuthContext';
import { IAuthState } from '../context/AuthContext';

export const useAuthContext = (): {
  state: IAuthState;
  dispatch: Dispatch<IAuthAction>;
} => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider');
  }

  return context;
};
