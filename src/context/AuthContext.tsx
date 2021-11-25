import {
  createContext,
  useReducer,
  useEffect,
  FC,
  ReactNode,
  Dispatch,
} from 'react';

// firebase
import { auth, firestoreDatabase } from '../firebase/config';
import { onAuthStateChanged } from '@firebase/auth';
import { doc, onSnapshot } from '@firebase/firestore';

// interfaces
import {
  AuthAction,
  AuthActionType,
  AuthState,
  Profile,
} from '../interfaces/auth.interface';

const initialAuthState: AuthState = {
  isAuthenticationReady: false,
  profile: null,
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
        user: action.payload?.user || null,
      };
    case AuthActionType.Login:
      return {
        ...state,
        user: action.payload?.user || null,
      };
    case AuthActionType.Logout:
      return {
        ...state,
        user: null,
        profile: null,
      };
    case AuthActionType.SetProfile:
      return {
        ...state,
        profile: action.payload?.profile || null,
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
        payload: { user },
      });
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (state.user) {
      const profileRef = doc(firestoreDatabase, 'users', state.user.uid);
      const unsubscribeProfile = onSnapshot(profileRef, profileSnapshot => {
        dispatch({
          type: AuthActionType.SetProfile,
          payload: { profile: profileSnapshot.data() as Profile },
        });
      });
      return () => unsubscribeProfile();
    }
  }, [state.user]);

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
