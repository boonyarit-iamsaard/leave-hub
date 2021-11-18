import { useEffect, useState } from 'react';

// interfaces
import { Profile } from '../interfaces/auth.interface';

// hooks
import useUserList from './useUserList';
import useAuthContext from './useAuthContext';

const useProfile = (): { profile: Profile } => {
  const { userList } = useUserList();
  const {
    state: { user },
  } = useAuthContext();
  const [profile, setProfile] = useState<Profile>({} as Profile);

  useEffect(() => {
    if (user && user.uid) {
      const { uid } = user;
      const profile = userList.find(user => user.uid === uid);

      if (profile) setProfile(profile);
    }
  }, [userList, user]);

  return { profile };
};

export default useProfile;
