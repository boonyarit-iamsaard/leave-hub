import {
  createContext,
  useReducer,
  useEffect,
  FC,
  ReactNode,
  Dispatch,
} from 'react';

// firebase
import { auth } from '../firebase/config';
import { onAuthStateChanged } from '@firebase/auth';

// interfaces
import {
  AuthAction,
  AuthActionTypes,
  AuthState,
} from '../interfaces/auth.interface';

const initialAuthState: AuthState = {
  isAuthenticationReady: false,
  user: null,
};

export const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}>({
  state: initialAuthState,
  dispatch: () => null,
});

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case AuthActionTypes.SetIsAuthenticationReady:
      return { user: action.payload, isAuthenticationReady: true };
    case AuthActionTypes.Login:
      return { ...state, user: action.payload };
    case AuthActionTypes.Logout:
      return { ...state, user: null };
    default:
      return state;
  }
};

export const AuthContextProvider: FC<ReactNode> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      dispatch({
        type: AuthActionTypes.SetIsAuthenticationReady,
        payload: user,
      });

      unsubscribe();
    });
  }, []);

  console.log('AuthContextProvider', state);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
