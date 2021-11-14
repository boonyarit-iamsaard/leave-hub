// firebase
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

// context
import { useAuthContext } from './useAuthContext';
import { IAuthActionTypes } from '../context/AuthContext';

const useLogout = (): { logout: () => Promise<void> } => {
  const { dispatch } = useAuthContext();

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      dispatch({ type: IAuthActionTypes.Logout, payload: null });
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
