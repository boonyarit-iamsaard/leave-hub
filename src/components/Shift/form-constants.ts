import { Profile } from '../../interfaces/auth.interface';
import {
  RosterType,
  Shift,
  ShiftPriority,
  ShiftStatus,
  ShiftType,
} from '../../interfaces/roster.interface';
import { v4 as uuidv4 } from 'uuid';

export const defaultFormValues = (
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

export const shiftTypeOptions = [
  { value: ShiftType.X, label: 'X' },
  { value: ShiftType.ANL, label: 'ANL' },
  { value: ShiftType.H, label: 'H' },
];

export const shiftPriorityOptions = [
  { value: ShiftType.X, label: 'X' },
  { value: ShiftType.ANL, label: 'ANL' },
  { value: ShiftType.H, label: 'H' },
  { value: ShiftPriority.ANL1, label: 'ANL1' },
  { value: ShiftPriority.ANL2, label: 'ANL2' },
  { value: ShiftPriority.ANL3, label: 'ANL3' },
  { value: ShiftPriority.Carryover, label: 'Carryover' },
  { value: ShiftPriority.TYC, label: 'TYC' },
];

export const shiftStatusOptions = [
  { value: ShiftStatus.Pending, label: 'Pending' },
  { value: ShiftStatus.Approved, label: 'Approved' },
  { value: ShiftStatus.Rejected, label: 'Rejected' },
];

export const userListOptions = (
  userList: Profile[]
): { label: string; value: string }[] => {
  return userList.map(user => ({
    value: user.uid,
    label: user.firstName,
  }));
};
