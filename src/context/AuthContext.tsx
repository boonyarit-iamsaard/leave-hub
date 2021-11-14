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
import { onAuthStateChanged, User } from '@firebase/auth';

export enum IAuthActionTypes {
  Login,
  Logout,
  SetIsAuthenticationReady,
}

export interface IAuthState {
  isAuthenticationReady: boolean;
  user: User | null;
}

export interface IAuthAction {
  type: IAuthActionTypes;
  payload: User | null;
}

const initialAuthState: IAuthState = {
  isAuthenticationReady: false,
  user: null,
};

export const AuthContext = createContext<{
  state: IAuthState;
  dispatch: Dispatch<IAuthAction>;
}>({
  state: initialAuthState,
  dispatch: () => null,
});

export const authReducer = (
  state: IAuthState,
  action: IAuthAction
): IAuthState => {
  switch (action.type) {
    case IAuthActionTypes.SetIsAuthenticationReady:
      return { user: action.payload, isAuthenticationReady: true };
    case IAuthActionTypes.Login:
      return { ...state, user: action.payload };
    case IAuthActionTypes.Logout:
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
        type: IAuthActionTypes.SetIsAuthenticationReady,
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
