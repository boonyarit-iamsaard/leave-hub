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
}

// TODO: reuse this component in roster page
// TODO: add create mode functionality
const ShiftForm: FC<ShiftFormProps> = ({
  handleClose,
  mode = ShiftFormMode.EDIT,
  open = false,
  selectedProfile,
  year = 2022,
  month = 0,
  shift,
}) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [shouldDisabled, setShouldDisabled] = useState(false);
  const { profile } = useProfile();
  const { removeShiftDocument, setShiftDocument } = useShiftList();
  const { settings } = useSettings();
  const { shiftsCount } = useProfileSummary(selectedProfile.uid);
  const { userList } = useUserList();

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
    const defaultDisabled: string[] = [ShiftType.X];
    const isTYCAssigned = profile.tyc > 0;
    const isTYCUsed = priorities.TYC > 0;
    const isANL1Used = priorities.ANL1 > 0;
    const isANL2Used = priorities.ANL2 > 0;
    const isANLType = type === ShiftType.ANL;

    if (profile.isAdmin) return [];

    if (isANLType && settings.phase !== Phase.B) {
      let disabled = [...defaultDisabled, ShiftType.H, ShiftType.ANL];
      if (isANL1Used) disabled = [...disabled, ShiftPriority.ANL1];
      if (isANL2Used) disabled = [...disabled, ShiftPriority.ANL2];
      if (isTYCAssigned && isTYCUsed)
        disabled = [...disabled, ShiftPriority.TYC];
      if (!isTYCAssigned) disabled = [...disabled, ShiftPriority.TYC];

      return disabled;
    }

    if (isANLType && settings.phase === Phase.B) {
      const disabled = [...defaultDisabled, ShiftType.H];
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
    handleClose();
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

    handleClose();
  };

  useEffect(() => {
    if (mode === ShiftFormMode.EDIT && !!Object.keys(shift).length) {
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
      setValue('priority', shift ? shift.priority : predefinedPriority);
      setShouldDisabled(false);
    }
  }, [shift, type, setValue, settings.phase]);

  return (
    <Dialog
      onClose={handleClose}
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
            <InputSelect
              label="User"
              name="uid"
              options={userListOptions(userList)}
              shouldDisabled={mode === ShiftFormMode.EDIT}
            />
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
