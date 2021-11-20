import { useState } from 'react';

import { auth } from '../firebase/config';
import { sendPasswordResetEmail } from '@firebase/auth';
import { FirebaseError } from '@firebase/util';

const useResetPassword = (): {
  error: string | null;
  isPending: boolean;
  resetPassword: (email: string) => Promise<boolean>;
} => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsPending(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsPending(false);
      return true;
    } catch (error) {
      (error as FirebaseError)
        ? setError((error as FirebaseError).message)
        : setError('An unknown error occurred.');

      setIsPending(false);
      return false;
    }
  };

  return { error, isPending, resetPassword };
};

export default useResetPassword;
