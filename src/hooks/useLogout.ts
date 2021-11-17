// firebase
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

// context
import { useAuthContext } from './useAuthContext';

// interfaces
import { AuthActionTypes } from '../interfaces/auth.interface';

const useLogout = (): { logout: () => Promise<void> } => {
  const { dispatch } = useAuthContext();

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      dispatch({ type: AuthActionTypes.Logout, payload: null });
    } catch (error) {
      // TODO: handle error
      console.log(error);
    }
  };

  return {
    logout,
  };
};

export default useLogout;
