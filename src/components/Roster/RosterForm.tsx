// noinspection DuplicatedCode

import { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { format, isBefore } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';

// firebase
import { realtimeDatabase } from '../../firebase/config';
import { ref, set } from '@firebase/database';

// components
import { InputDatepicker, InputSelect } from '../Input';

// interfaces
import {
  RosterType,
  Shift,
  ShiftPriority,
  ShiftStatus,
  ShiftType,
} from '../../interfaces/roster.interface';
import { Profile } from '../../interfaces/auth.interface';

// hooks
import useProfileSummary from '../../hooks/useProfileSummary';
import useSettings, { Phase } from '../../hooks/useSettings';
import useShiftList from '../../hooks/useShiftList';
import useUserList from '../../hooks/useUserList';

// TODO: move to constants folder
// form constants
const defaultFormValues = (
  profile: Profile,
  year: number,
  month: number
): Shift => ({
  id: uuidv4(),
  uid: profile.uid,
  startDate: new Date(year, month),
  endDate: new Date(year, month),
  type: ShiftType.ANL,
  roster:
    profile.roster === RosterType.Mechanic
      ? RosterType.Mechanic
      : RosterType.Engineer,
  priority: ShiftPriority.ANL3,
  status: ShiftStatus.Pending,
});
const shiftTypeOptions = [
  { value: ShiftType.X, label: 'X' },
  { value: ShiftType.ANL, label: 'ANL' },
  { value: ShiftType.H, label: 'H' },
];
const shiftPriorityOptions = [
  { value: ShiftType.X, label: 'X' },
  { value: ShiftType.ANL, label: 'ANL' },
  { value: ShiftType.H, label: 'H' },
  { value: ShiftPriority.ANL1, label: 'ANL1' },
  { value: ShiftPriority.ANL2, label: 'ANL2' },
  { value: ShiftPriority.ANL3, label: 'ANL3' },
  { value: ShiftPriority.Carryover, label: 'Carryover' },
  { value: ShiftPriority.TYC, label: 'TYC' },
];
const shiftStatusOptions = [
  { value: ShiftStatus.Pending, label: 'Pending' },
  { value: ShiftStatus.Approved, label: 'Approved' },
  { value: ShiftStatus.Rejected, label: 'Rejected' },
];
const userListOptions = (userList: Profile[]) => {
  return userList.map(user => ({
    value: user.uid,
    label: user.firstName,
  }));
};

interface RostersFormProps {
  dialogOpen: boolean;
  handleConfirmDialog: (shift: Shift) => void;
  handleDialogOpen: () => void;
  isDeletePending: boolean;
  month: number;
  profile: Profile;
  shift?: Shift;
  year: number;
  rosterType: RosterType;
}

const RosterForm: FC<RostersFormProps> = ({
  dialogOpen,
  handleConfirmDialog,
  handleDialogOpen,
  isDeletePending,
  month,
  profile,
  shift,
  year,
  rosterType = RosterType.Mechanic,
}) => {
  const [currentUid, setCurrentUid] = useState<string>(profile.uid);
  const [isPending, setIsPending] = useState(false);
  const [shouldDisabled, setShouldDisabled] = useState(false);
  const { setShiftDocument } = useShiftList();
  const { settings } = useSettings();
  const { userList } = useUserList(rosterType);
  const { shiftsCount } = useProfileSummary(currentUid);

  const methods = useForm<Shift>({
    defaultValues: {
      ...defaultFormValues(profile, year, month),
    },
  });
  const { handleSubmit, watch, setValue } = methods;
  const { startDate, endDate, type, createdAt, uid } = watch();

  const handleResetForm = useCallback(() => {
    const { isAdmin, roster } = profile;
    const defaultValues = defaultFormValues(profile, year, month);

    Object.keys(defaultValues).forEach(key => {
      setValue(key as keyof Shift, defaultValues[key as keyof Shift]);
    });

    if (settings.phase === Phase.B) setValue('priority', ShiftType.ANL);

    if (isAdmin && roster !== rosterType) setValue('uid', userList[0].uid);
  }, [month, profile, rosterType, setValue, settings.phase, userList, year]);

  const disabledShiftTypes = profile.isAdmin ? [] : [ShiftType.X];
  const disabledShiftPriorities = () => {
    const { priorities } = shiftsCount;
    const carryover = profile.carryover || 0;
    const defaultDisabled: string[] = [ShiftType.X];
    const hasANL1Used = priorities.ANL1 > 0;
    const hasANL2Used = priorities.ANL2 > 0;
    const hasCarryover = carryover > 0;
    const carryoverUsed = priorities.Carryover;
    const hasTYC = profile.tyc > 0;
    const hasTYCUsed = priorities.TYC > 0;
    const isANLType = type === ShiftType.ANL;

    if (profile.isAdmin) return [];

    if (!hasCarryover) defaultDisabled.push(ShiftPriority.Carryover);

    if (isANLType && settings.phase === Phase.A) {
      let disabled = [...defaultDisabled, ShiftType.H, ShiftType.ANL];
      if (hasCarryover) disabled = [...disabled, ShiftPriority.Carryover];
      if (hasANL1Used) disabled = [...disabled, ShiftPriority.ANL1];
      if (hasANL2Used) disabled = [...disabled, ShiftPriority.ANL2];
      if (hasTYC && hasTYCUsed) disabled = [...disabled, ShiftPriority.TYC];
      if (!hasTYC) disabled = [...disabled, ShiftPriority.TYC];

      return disabled;
    }

    if (isANLType && settings.phase === Phase.B) {
      const carryover = profile.carryover || 0;
      let disabled = [...defaultDisabled, ShiftType.H];
      if (hasCarryover && carryoverUsed >= carryover)
        disabled = [...disabled, ShiftPriority.Carryover];
      return [
        ...disabled,
        ShiftType.H,
        ShiftPriority.ANL1,
        ShiftPriority.ANL2,
        ShiftPriority.ANL3,
        ShiftPriority.TYC,
      ];
    }

    return defaultDisabled;
  };

  const handleCloseForm = () => {
    handleResetForm();
    handleDialogOpen();
  };

  const handleSubmitRosterForm = async (data: Shift) => {
    setIsPending(true);
    if (!data.createdAt) {
      data.createdAt = Date.now();
      data.updatedAt = Date.now();
      data.status =
        data.type !== ShiftType.X ? ShiftStatus.Pending : ShiftStatus.Approved;
    } else data.updatedAt = Date.now();

    if (data.type === ShiftType.X) {
      await set(ref(realtimeDatabase, 'days-off/' + data.id), {
        ...data,
        startDate: format(data.startDate, 'yyyy-MM-dd'),
        endDate: format(data.endDate, 'yyyy-MM-dd'),
      });
      setIsPending(false);
    } else {
      await setShiftDocument(data);
      setIsPending(false);
    }

    handleCloseForm();
  };

  useEffect(() => {
    if (shift) {
      Object.keys(shift).forEach(key => {
        setValue(key as keyof Shift, shift[key as keyof Shift]);
      });
    } else {
      handleResetForm();
    }
  }, [handleResetForm, setValue, shift]);

  useEffect(() => {
    if (isBefore(endDate, startDate)) setValue('endDate', startDate);
  }, [startDate, endDate, setValue, shift]);

  useEffect(() => {
    if (type === ShiftType.X) {
      setValue('priority', ShiftType.X);
      setValue('status', ShiftStatus.Approved);
      setShouldDisabled(true);
    }
    if (type === ShiftType.H) {
      setValue('priority', ShiftType.H);
      setShouldDisabled(true);
    }
    if (type === ShiftType.ANL) {
      setValue(
        'priority',
        settings.phase === Phase.B ? ShiftType.ANL : ShiftPriority.ANL3
      );
      setShouldDisabled(false);
    }
  }, [type, setValue, settings.phase]);

  useEffect(() => {
    if (uid) {
      setCurrentUid(uid);
    }
  }, [uid]);

  return (
    <Dialog
      className="roster-form"
      sx={{
        color: '#fff',
        zIndex: theme => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(3px)',
        '& .MuiDialog-paper': {
          m: 2,
          width: '100%',
          maxWidth: '400px',
        },
      }}
      open={dialogOpen}
      onClose={handleCloseForm}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(data => handleSubmitRosterForm(data))}>
          <DialogTitle sx={{ p: 2 }}>Roster Form</DialogTitle>

          <Divider />

          <DialogContent
            className="roster-form_content"
            sx={{ width: '100%', mx: 'auto', p: 2 }}
          >
            {profile.isAdmin && (
              <InputSelect
                label="User"
                name="uid"
                options={userListOptions(userList)}
              />
            )}

            <InputDatepicker
              label="Start Date"
              name="startDate"
              year={year}
              month={month}
            />

            <InputDatepicker
              label="End Date"
              minDate={startDate}
              name="endDate"
              year={year}
              month={month}
            />

            <InputSelect
              disabledOptions={disabledShiftTypes}
              label="Type"
              name="type"
              options={shiftTypeOptions}
            />

            <InputSelect
              disabledOptions={disabledShiftPriorities()}
              label="Priority"
              name="priority"
              options={shiftPriorityOptions}
              shouldDisabled={shouldDisabled}
            />

            {shift && (
              <InputSelect
                shouldDisabled={!profile.isAdmin}
                label="Status"
                name="status"
                options={shiftStatusOptions}
              />
            )}
          </DialogContent>
          <Divider />
          <DialogActions
            sx={{
              display: 'flex',
              p: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {profile.isAdmin && createdAt && (
              <Button
                color="error"
                disabled={isPending || isDeletePending}
                onClick={() => handleConfirmDialog(watch())}
                size="large"
                variant="outlined"
              >
                {isDeletePending ? 'Deleting...' : 'Delete'}
              </Button>
            )}
            <Button
              className={isPending ? '' : 'shadow'}
              disabled={isPending}
              variant="contained"
              size="large"
              type="submit"
              sx={{
                ml: profile.isAdmin && createdAt ? 0 : 'auto',
              }}
            >
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default RosterForm;
