// noinspection DuplicatedCode

import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { format, isBefore } from 'date-fns';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';

import { ref, remove, set } from '@firebase/database';
import { realtimeDatabase } from '../../firebase/config';

import { InputDatepicker, InputSelect } from '../Input';

import {
  RosterType,
  Shift,
  ShiftPriority,
  ShiftStatus,
  ShiftType,
} from '../../interfaces/roster.interface';
import { Profile } from '../../interfaces/auth.interface';

import {
  defaultFormValues,
  shiftPriorityOptions,
  shiftStatusOptions,
  shiftTypeOptions,
  userListOptions,
} from './form-constants';

import { ConfirmDialog } from '../Common';

import useProfile from '../../hooks/useProfile';
import useProfileSummary from '../../hooks/useProfileSummary';
import useSettings, { Phase } from '../../hooks/useSettings';
import useShiftList from '../../hooks/useShiftList';
import useUserList from '../../hooks/useUserList';

export enum ShiftFormMode {
  CREATE = 'create',
  EDIT = 'edit',
}

interface ShiftFormProps {
  handleClose: () => void;
  mode: ShiftFormMode;
  month?: number;
  open: boolean;
  selectedProfile: Profile;
  shift: Shift;
  year?: number;
  roster?: RosterType;
}

const ShiftForm: FC<ShiftFormProps> = ({
  handleClose,
  mode = ShiftFormMode.EDIT,
  open = false,
  selectedProfile,
  year = 2022,
  month = 0,
  shift,
  roster,
}) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [shouldDisabled, setShouldDisabled] = useState(false);
  const { profile } = useProfile();
  const { removeShiftDocument, setShiftDocument } = useShiftList();
  const { settings } = useSettings();
  const { shiftsCount } = useProfileSummary(selectedProfile.uid);
  const { userList } = useUserList(roster);

  const methods = useForm<Shift>({
    defaultValues: {
      ...defaultFormValues(selectedProfile, year, month),
    },
  });
  const { handleSubmit, watch, setValue } = methods;
  const { createdAt, endDate, startDate, type } = watch();

  const disabledShiftTypes = profile.isAdmin ? [] : [ShiftType.X];
  const disabledShiftPriorities = () => {
    const { priorities } = shiftsCount;
    const booserVaccinationLeaveUsed = priorities.Vaccination;
    const boosterVaccinationLeave = profile.boosterVaccinationLeave || 0;
    const carryover = profile.carryover || 0;
    const carryoverUsed = priorities.Carryover;
    const defaultDisabled: string[] = [ShiftType.X];
    const hasANL1Used = priorities.ANL1 > 0;
    const hasANL2Used = priorities.ANL2 > 0;
    const hasBoosterVaccinationLeave = boosterVaccinationLeave > 0;
    const hasCarryover = carryover > 0;
    const hasTYC = profile.tyc > 0;
    const hasTYCUsed = priorities.TYC > 0;
    const isANLType = type === ShiftType.ANL;
    const isOtherType = type === ShiftType.Other;

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

    if (isOtherType) {
      const boosterVaccinationLeave = profile.boosterVaccinationLeave || 0;
      let disabled = [
        ...defaultDisabled,
        ShiftType.H,
        ShiftType.ANL,
        ShiftPriority.ANL1,
        ShiftPriority.ANL2,
        ShiftPriority.ANL3,
        ShiftPriority.TYC,
      ];

      if (
        hasBoosterVaccinationLeave &&
        booserVaccinationLeaveUsed >= boosterVaccinationLeave
      )
        disabled = [...disabled, ShiftPriority.Vaccination];
      if (!hasBoosterVaccinationLeave)
        disabled = [...disabled, ShiftPriority.Vaccination];

      return disabled;
    }

    return defaultDisabled;
  };

  const handleToggleConfirmDialog = () =>
    setConfirmDialogOpen(!confirmDialogOpen);

  const handleDeleteShift = async (shift: Shift) => {
    setIsDeletePending(true);
    if (shift.type === ShiftType.X) {
      const docRef = ref(realtimeDatabase, 'days-off/' + shift.id);
      await remove(docRef);
      setIsDeletePending(false);
    } else {
      await removeShiftDocument(shift);
      setIsDeletePending(false);
    }

    handleToggleConfirmDialog();
    handleResetShiftForm();
  };

  const handleSubmitShiftForm = async (shift: Shift) => {
    setIsPending(true);

    if (!shift.createdAt) {
      shift.createdAt = Date.now();
      shift.updatedAt = Date.now();
      shift.status =
        shift.type !== ShiftType.X ? ShiftStatus.Pending : ShiftStatus.Approved;
    } else shift.updatedAt = Date.now();

    if (shift.type === ShiftType.X) {
      await set(ref(realtimeDatabase, 'days-off/' + shift.id), {
        ...shift,
        startDate: format(shift.startDate, 'yyyy-MM-dd'),
        endDate: format(shift.endDate, 'yyyy-MM-dd'),
      });
      setIsPending(false);
    } else {
      await setShiftDocument(shift);
      setIsPending(false);
    }

    handleResetShiftForm();
  };

  const handleResetShiftForm = () => {
    const defaultValues = defaultFormValues(selectedProfile, year, month);
    if (profile.isAdmin && profile.roster !== roster) {
      defaultValues.uid = userList[0].uid;
      defaultValues.roster = userList[0].roster;
    }
    if (settings.phase === Phase.B) {
      defaultValues.priority = ShiftType.ANL;
    }

    Object.keys(defaultValues).forEach(key => {
      setValue(key as keyof Shift, defaultValues[key as keyof Shift]);
    });

    handleClose();
  };

  useEffect(() => {
    if (mode === ShiftFormMode.EDIT) {
      Object.keys(shift).forEach(key => {
        setValue(key as keyof Shift, shift[key as keyof Shift]);
      });
    }
  }, [setValue, mode, shift]);

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
      const predefinedPriority =
        settings.phase === Phase.B ? ShiftType.ANL : ShiftPriority.ANL3;
      setValue(
        'priority',
        shift && shift.priority ? shift.priority : predefinedPriority
      );
      setShouldDisabled(false);
    }
    if (type === ShiftType.Other) {
      setValue(
        'priority',
        shift && shift.priority ? shift.priority : ShiftType.Other
      );
      setShouldDisabled(false);
    }
  }, [shift, type, setValue, settings.phase]);

  useEffect(() => {
    if (
      profile.isAdmin &&
      profile.roster !== roster &&
      mode === ShiftFormMode.CREATE
    ) {
      setValue('uid', userList[0].uid);
      setValue('roster', userList[0].roster);
    } else {
      setValue('uid', selectedProfile.uid);
      setValue('roster', selectedProfile.roster);
    }
  }, [
    mode,
    profile,
    roster,
    selectedProfile.roster,
    selectedProfile.uid,
    setValue,
    userList,
  ]);

  useEffect(() => {
    if (mode === ShiftFormMode.CREATE) {
      setValue('startDate', new Date(year, month));
      setValue('endDate', new Date(year, month));
    }
  }, [mode, month, setValue, year]);

  return (
    <Dialog
      onClose={handleResetShiftForm}
      open={open}
      className="shift-form"
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
    >
      <ConfirmDialog
        isConfirmPending={isDeletePending}
        message="Are you sure you want to delete this item?"
        onClose={handleToggleConfirmDialog}
        onConfirm={() => handleDeleteShift(watch())}
        open={confirmDialogOpen}
        title="Confirm"
      />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(shift => handleSubmitShiftForm(shift))}>
          <DialogTitle sx={{ p: 2, textTransform: 'capitalize' }}>
            {mode}
          </DialogTitle>
          <Divider />
          <DialogContent
            className="shift-form_content"
            sx={{ width: '100%', mx: 'auto', p: 2 }}
          >
            {profile.isAdmin && (
              <InputSelect
                label="User"
                name="uid"
                options={userListOptions(userList)}
                shouldDisabled={mode === ShiftFormMode.EDIT}
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
                onClick={handleToggleConfirmDialog}
                size="large"
                variant="outlined"
              >
                {isDeletePending ? 'Deleting...' : 'Delete'}
              </Button>
            )}
            <Button
              className={isPending ? '' : 'shadow'}
              disabled={isPending}
              size="large"
              sx={{
                ml: profile.isAdmin && createdAt ? 0 : 'auto',
              }}
              type="submit"
              variant="contained"
            >
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ShiftForm;
