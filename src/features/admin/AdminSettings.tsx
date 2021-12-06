import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';

import { ref, set } from '@firebase/database';
import { realtimeDatabase } from '../../firebase/config';

import { InputSelect } from '../../components/Input';

import useSettings, { Phase, Settings } from '../../hooks/useSettings';

const AdminSettingsContainer = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
}));

const AdminSettingsHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
});

const yearOptions = () => {
  const years = [];
  const initialYear = new Date().getFullYear();
  for (let i = initialYear - 2; i <= initialYear + 3; i++) {
    years.push({
      label: `${i}`,
      value: `${i}`,
    });
  }
  return years;
};

const AdminSettings: FC = () => {
  const [isPending, setIsPending] = useState(false);
  const { settings } = useSettings();
  const methods = useForm<Settings>({
    defaultValues: {
      phase: Phase.A,
      activeYear: new Date().getFullYear(),
    },
  });
  const { handleSubmit, reset } = methods;

  const handleClickCancel = () => {
    reset(settings);
  };

  const handleSubmitSettingsForm = async (data: Settings) => {
    setIsPending(true);
    try {
      const settingsRef = ref(realtimeDatabase, 'settings');
      await set(settingsRef, { ...data, activeYear: Number(data.activeYear) });
      setIsPending(false);
    } catch (error) {
      setIsPending(false);
      console.error(error);
    }
  };

  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  return (
    <AdminSettingsContainer>
      <AdminSettingsHeader>
        <Typography variant="h6">Settings</Typography>
      </AdminSettingsHeader>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitSettingsForm)}>
          <Card className="shadow" sx={{ maxWidth: 400, mx: 'auto' }}>
            <CardContent>
              <InputSelect
                label="Phase"
                name="phase"
                options={[
                  { value: Phase.A, label: 'Phase A' },
                  { value: Phase.B, label: 'Phase B' },
                ]}
              />
              <InputSelect
                label="Year"
                name="activeYear"
                options={yearOptions()}
              />
            </CardContent>
            <CardActions
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pb: 2,
                pt: 0,
                px: 2,
              }}
            >
              <Button
                color="secondary"
                disabled={isPending}
                onClick={handleClickCancel}
              >
                Cancel
              </Button>
              <Button
                className={isPending ? '' : 'shadow'}
                color="primary"
                disabled={isPending}
                type="submit"
                variant="contained"
              >
                {isPending ? 'Saving...' : 'Save'}
              </Button>
            </CardActions>
          </Card>
        </form>
      </FormProvider>
    </AdminSettingsContainer>
  );
};

export default AdminSettings;
