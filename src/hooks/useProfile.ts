import { useEffect, useState } from 'react';

// interfaces
import { Profile } from '../interfaces/auth.interface';

// hooks
import useUsers from './useUsers';
import useAuthContext from './useAuthContext';

const useProfile = (): { profile: Profile } => {
  const { users } = useUsers();
  const {
    state: { user },
  } = useAuthContext();
  const [profile, setProfile] = useState<Profile>({} as Profile);

  useEffect(() => {
    if (user && user.uid) {
      const { uid } = user;
      const profile = users.find(user => user.uid === uid);

      if (profile) setProfile(profile);
    }
  }, [users, user]);

  return { profile };
};

export default useProfile;
