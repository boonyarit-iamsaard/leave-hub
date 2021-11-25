import { useState } from 'react';

// firebase
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, AuthError, User } from 'firebase/auth';

// context
import useAuthContext from './useAuthContext';

// interfaces
import { AuthActionType, UserCredential } from '../interfaces/auth.interface';

const useLogin = (): {
  error: string;
  login: (credentials: UserCredential) => Promise<User | undefined>;
  isPending: boolean;
} => {
  const [error, setError] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const login = async (userCredentioal: UserCredential) => {
    const { email, password } = userCredentioal;

    setIsPending(true);

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      dispatch({
        type: AuthActionType.Login,
        payload: {
          user: response.user,
        },
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
