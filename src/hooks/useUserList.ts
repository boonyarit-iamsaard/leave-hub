import { useEffect, useState } from 'react';

// firebase
import { firestoreDatabase } from '../firebase/config';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  FirestoreError,
} from 'firebase/firestore';

// interfaces
import { Profile } from '../interfaces/auth.interface';
import { RosterType } from '../interfaces/roster.interface';

const referenceList = {
  Engineer: [
    'Patrick',
    'Khomkrit',
    'Mun',
    'Amnuay',
    'Kritsadakorn',
    'Anusara',
    'Tanakorn',
    'Srisuphan',
    'Chanon',
    'Rattapichai',
    'Weerachai',
    'Sirikorn',
  ],
  Mechanic: [
    'Thusnai',
    'Vitsanu',
    'Anuwit',
    'Thanakruite',
    'Attala',
    'Weerasarut',
    'Ekkasit',
    'Danai',
    'Siri',
    'Thinagon',
    'Adisorn',
    'Pornsak',
    'Boonyarit',
    'Theerapong',
    'Totsapon',
    'Saran',
    'Putthipong',
  ],
};

const useUserList = (
  roster?: RosterType
): {
  userList: Profile[];
  loading: boolean;
  error: string | null;
  setUserDocument: (user: Profile) => Promise<void>;
} => {
  const [userList, setUserList] = useState<Profile[]>([] as Profile[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUserDocument = async (user: Profile): Promise<void> => {
    setLoading(true);

    try {
      const ref = doc(firestoreDatabase, 'users', user.uid);
      await setDoc(ref, user);
      setLoading(false);
    } catch (error) {
      error instanceof FirestoreError
        ? setError(error.message)
        : setError('An unknown error occurred.');

      setLoading(false);
    }
  };

  useEffect(() => {
    const ref = collection(firestoreDatabase, 'users');
    const unsubscribe = onSnapshot(ref, snapshot => {
      const userList: Profile[] = [];

      snapshot.forEach(doc => {
        const user = doc.data() as Profile;
        userList.push(user);
      });

      if (roster && roster === RosterType.Mechanic) {
        const filteredUserList = userList.filter(
          user => user.roster === RosterType.Mechanic
        );

        const sortedUserList = referenceList.Mechanic.filter(name => name).map(
          name => {
            const user = filteredUserList.find(user => user.firstName === name);
            return user ? user : ({ firstName: name } as Profile);
          }
        );

        setUserList(sortedUserList);
      }

      if (roster && roster === RosterType.Engineer) {
        const filteredUserList = userList.filter(
          user => user.roster === RosterType.Engineer
        );

        const sortedUserList = referenceList.Engineer.filter(name => name).map(
          name => {
            const user = filteredUserList.find(user => user.firstName === name);
            return user ? user : ({ firstName: name } as Profile);
          }
        );

        setUserList(sortedUserList);
      }

      if (!roster) setUserList(userList);
    });

    return () => unsubscribe();
  }, [roster]);

  return { userList, loading, error, setUserDocument };
};

export default useUserList;
