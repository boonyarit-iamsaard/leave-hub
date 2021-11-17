import { useEffect, useState } from 'react';

// firebase
import { firestoreDatabase } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

// interfaces
import { Profile } from '../interfaces/auth.interface';

const useUsers = () => {
  const [users, setUsers] = useState<Profile[]>([] as Profile[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ref = collection(firestoreDatabase, 'users');
    const unsubscribe = onSnapshot(ref, snapshot => {
      const users: Profile[] = [];

      snapshot.forEach(doc => {
        const user = doc.data() as Profile;
        users.push(user);
      });

      setUsers(users);
    });

    return () => unsubscribe();
  }, []);

  return { users, loading, error };
};

export default useUsers;
