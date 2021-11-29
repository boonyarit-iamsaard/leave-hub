import { useEffect, useState } from 'react';

import { doc, onSnapshot } from '@firebase/firestore';
import { firestoreDatabase } from '../firebase/config';

// interfaces
import { Profile } from '../interfaces/auth.interface';

// hooks
import useAuthContext from './useAuthContext';

const useProfile = (): { profile: Profile } => {
  const {
    state: { user },
  } = useAuthContext();
  const [profile, setProfile] = useState<Profile>({} as Profile);

  useEffect(() => {
    if (user) {
      const profileRef = doc(firestoreDatabase, 'users', user.uid);
      const unsubscribeProfile = onSnapshot(profileRef, profileSnapshot => {
        if (profileSnapshot.exists()) {
          const profileData = profileSnapshot.data();
          setProfile({
            ...profileData,
          } as Profile);
        }
      });
      return () => unsubscribeProfile();
    }
  }, [user]);

  return { profile };
};

export default useProfile;
