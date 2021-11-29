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
  AuthActionType,
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
    case AuthActionType.SetIsAuthenticationReady:
      return {
        ...state,
        isAuthenticationReady: true,
        user: action.payload || null,
      };
    case AuthActionType.Login:
      return {
        ...state,
        user: action.payload || null,
      };
    case AuthActionType.Logout:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

let renderCount = 0;
export const AuthContextProvider: FC<ReactNode> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      dispatch({
        type: AuthActionType.SetIsAuthenticationReady,
        payload: user,
      });
    });
    return () => unsubscribeAuth();
  }, []);

  renderCount++;
  console.log('AuthContext<state>: ', state);
  console.log('renderCount: ', renderCount);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
