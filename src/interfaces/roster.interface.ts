export interface Roster {
  id: string;
  shiftId: string;
  uid: string;
  date: Date;
  type: ShiftType;
  roster: RosterType;
  status: ShiftStatus;
  priority: ShiftPriority | ShiftType;
}

export interface Shift {
  id: string;
  uid: string;
  startDate: Date;
  endDate: Date;
  type: ShiftType;
  roster: RosterType;
  priority: ShiftPriority | ShiftType;
  status: ShiftStatus;
  createdAt?: number;
  updatedAt?: number;
}

export enum RosterType {
  Mechanic = 'Mechanic',
  Engineer = 'Engineer',
}

export enum ShiftStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum ShiftType {
  X = 'X',
  ANL = 'ANL',
  H = 'H',
}

// must be use in conjunction with ShiftType
export enum ShiftPriority {
  ANL1 = 'ANL1',
  ANL2 = 'ANL2',
  ANL3 = 'ANL3',
  TYC = 'TYC',
  Carryover = 'Carryover',
}
