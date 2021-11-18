import { useEffect, useState } from 'react';

// firebase
import { firestoreDatabase } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

// interfaces
import { Profile } from '../interfaces/auth.interface';

const useUserList = (): {
  userList: Profile[];
  loading: boolean;
  error: string | null;
} => {
  const [userList, setUserList] = useState<Profile[]>([] as Profile[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ref = collection(firestoreDatabase, 'users');
    const unsubscribe = onSnapshot(ref, snapshot => {
      const userList: Profile[] = [];

      snapshot.forEach(doc => {
        const user = doc.data() as Profile;
        userList.push(user);
      });

      setUserList(userList);
    });

    return () => unsubscribe();
  }, []);

  return { userList, loading, error };
};

export default useUserList;
