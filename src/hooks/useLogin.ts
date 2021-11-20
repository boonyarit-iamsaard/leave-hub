import { useState } from 'react';

// firebase
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, AuthError, User } from 'firebase/auth';

// context
import useAuthContext from './useAuthContext';

// interfaces
import { AuthActionTypes, Credentials } from '../interfaces/auth.interface';

const useLogin = (): {
  error: string;
  login: (credentials: Credentials) => Promise<User | undefined>;
  isPending: boolean;
} => {
  const [error, setError] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const login = async (credentials: Credentials) => {
    const { email, password } = credentials;

    setIsPending(true);

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      dispatch({
        type: AuthActionTypes.Login,
        payload: response.user,
      });

      setIsPending(false);
      return response.user;
    } catch (error) {
      (error as AuthError)
        ? setError((error as AuthError).message)
        : setError('An unknown error occurred.');

      setIsPending(false);
    }
  };

  return { login, error, isPending };
};

export default useLogin;
