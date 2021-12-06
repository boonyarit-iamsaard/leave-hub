import { useEffect, useState } from 'react';

import { realtimeDatabase } from '../firebase/config';
import { ref, onValue } from 'firebase/database';

export type Settings = {
  phase: Phase;
  activeYear: number;
};

export enum Phase {
  A = 'A',
  B = 'B',
}

const useSettings = (): {
  settings: Settings;
} => {
  const [settings, setSettings] = useState<Settings>({
    phase: Phase.A,
    activeYear: 2022,
  });

  useEffect(() => {
    const settingsRef = ref(realtimeDatabase, 'settings');

    const settingsListener = onValue(settingsRef, snapshot => {
      setSettings({
        phase: snapshot.val().phase,
        activeYear: snapshot.val().activeYear,
      });
    });

    return () => {
      settingsListener();
    };
  }, []);

  return { settings };
};

export default useSettings;
