import { useEffect, useState } from 'react';

import { realtimeDatabase } from '../firebase/config';
import { ref, onValue } from 'firebase/database';

type Settings = {
  phase: Phase;
  activeYear: number;
};

enum Phase {
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
    const settingsReff = ref(realtimeDatabase, 'settings');

    const settingsListener = onValue(settingsReff, snapshot => {
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
