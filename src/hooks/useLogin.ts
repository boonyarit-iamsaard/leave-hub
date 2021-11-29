import { useEffect, useState } from 'react';

// firebase
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';

// context
import useAuthContext from './useAuthContext';

// interfaces
import { AuthActionType, UserCredential } from '../interfaces/auth.interface';

const useLogin = (): {
  error: string;
  login: (credentials: UserCredential) => Promise<void>;
  isPending: boolean;
} => {
  const [error, setError] = useState<string>('');
  const [isCancelled, setIsCancelled] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const login = async (userCredential: UserCredential) => {
    const { email, password } = userCredential;
    setError('');
    setIsPending(true);

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      dispatch({
        type: AuthActionType.Login,
        payload: response.user,
      });

      if (!isCancelled) {
        setIsPending(false);
        setError('');
      }
    } catch (error) {
      if (!isCancelled) {
        (error as AuthError) && !isCancelled
          ? setError((error as AuthError).message)
          : setError('An unknown error occurred.');

        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, error, isPending };
};

export default useLogin;
