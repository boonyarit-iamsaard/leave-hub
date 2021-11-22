import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { format } from 'date-fns';
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
  const [isPending, setIsPending] = useState(false);
  const [shouldDisabled, setShouldDisabled] = useState(false);
  const { setShiftDocument } = useShiftList();
  const { userList } = useUserList(rosterType);

  const methods = useForm<Shift>({
    defaultValues: {
      ...defaultFormValues(profile, year, month),
    },
  });
  const { handleSubmit, reset, watch, setValue } = methods;
  const { startDate, type, createdAt } = watch();

  const disabledShiftTypes = profile.isAdmin ? [] : [ShiftType.X];
  const disabledShiftPriorities = () => {
    if (profile.isAdmin) return [];

    if (profile.tyc > 0 && type === ShiftType.ANL)
      return [ShiftType.X, ShiftType.ANL, ShiftType.H];

    if (profile.tyc === 0 && type === ShiftType.ANL)
      return [ShiftType.X, ShiftType.ANL, ShiftType.H, ShiftPriority.TYC];

    return [ShiftType.X, ShiftType.ANL, ShiftPriority.TYC];
  };

  const handleCloseForm = () => {
    let uid = profile.uid;

    if (profile.isAdmin && profile.roster !== rosterType) uid = userList[0].uid;

    reset({
      id: uuidv4(),
      uid,
      startDate: new Date(year, month),
      endDate: new Date(year, month),
      type: ShiftType.ANL,
      roster: rosterType,
      priority: ShiftPriority.ANL3,
      status: ShiftStatus.Pending,
    });

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
      reset({ ...shift });
    } else {
      let uid = profile.uid;

      if (profile.isAdmin && profile.roster !== rosterType)
        uid = userList[0].uid;

      reset({
        id: uuidv4(),
        uid,
        startDate: new Date(year, month),
        endDate: new Date(year, month),
        type: ShiftType.ANL,
        roster: rosterType,
        priority: ShiftPriority.ANL3,
        status: ShiftStatus.Pending,
      });
    }
  }, [year, month, reset, profile, shift, rosterType, userList]);

  useEffect(() => {
    if (!shift) {
      setValue('endDate', startDate);
    }
  }, [startDate, setValue, shift]);

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
      setValue('priority', ShiftPriority.ANL3);
      setShouldDisabled(false);
    }
  }, [type, setValue]);

  useEffect(() => {
    if (
      rosterType === RosterType.Engineer &&
      profile.roster === RosterType.Mechanic
    ) {
      setValue('uid', userList[0].uid);
    }
  }, [rosterType, setValue, userList, profile]);

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

            <InputDatepicker label="Start Date" name="startDate" />

            <InputDatepicker
              label="End Date"
              minDate={startDate}
              name="endDate"
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
