import { useEffect, useState } from 'react';

// firebase
import { firestoreDatabase } from '../firebase/config';
import {
  collection,
  deleteDoc,
  doc,
  FirestoreError,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';

// interfaces
import { Shift } from '../interfaces/roster.interface';
import { format } from 'date-fns';

// hooks
import useProfile from './useProfile';
import useSettings, { Phase } from './useSettings';

const useShiftList = (): {
  error: string | null;
  loading: boolean;
  removeShiftDocument: (shift: Shift) => Promise<void>;
  setShiftDocument: (shift: Shift) => Promise<void>;
  shiftList: Shift[];
} => {
  const { profile } = useProfile();
  const { settings } = useSettings();
  const [shiftList, setShiftList] = useState<Shift[]>([] as Shift[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setShiftDocument = async (shift: Shift) => {
    setLoading(true);
    const docRef = doc(firestoreDatabase, 'shifts', shift.id);

    try {
      await setDoc(docRef, {
        ...shift,
        startDate: format(shift.startDate, 'yyyy-MM-dd'),
        endDate: format(shift.endDate, 'yyyy-MM-dd'),
      });

      setLoading(false);
    } catch (error) {
      error instanceof FirestoreError
        ? setError(error.message)
        : setError('An unknown error occurred.');

      setLoading(false);
    }
  };

  const removeShiftDocument = async (shift: Shift) => {
    setLoading(true);
    const docRef = doc(firestoreDatabase, 'shifts', shift.id);

    try {
      await deleteDoc(docRef);

      setLoading(false);
    } catch (error) {
      error instanceof FirestoreError
        ? setError(error.message)
        : setError('An unknown error occurred.');

      setLoading(false);
    }
  };

  useEffect(() => {
    const ref = collection(firestoreDatabase, 'shifts');
    const unsubscribe = onSnapshot(ref, snapshot => {
      const shiftList: Shift[] = [];

      snapshot.forEach(doc => {
        const shift: Shift = doc.data() as Shift;
        shift.id = doc.id;
        shift.startDate = new Date(shift.startDate);
        shift.endDate = new Date(shift.endDate);

        shiftList.push(shift);
      });

      setShiftList(
        profile.isAdmin || settings.phase === Phase.B
          ? shiftList
          : shiftList.filter(shift => shift.uid === profile.uid)
      );
    });

    return () => unsubscribe();
  }, [profile.isAdmin, profile.uid, setShiftList, settings.phase]);

  return {
    error,
    loading,
    removeShiftDocument,
    setShiftDocument,
    shiftList,
  };
};

export default useShiftList;
