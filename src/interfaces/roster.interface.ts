export interface Roster {
  id: string;
  shiftId: string;
  uid: string;
  date: Date;
  type: string;
  roster: string;
}

export interface RosterFormData {
  startDate: Date;
  endDate: Date;
}

export interface Shift {
  id: string;
  uid: string;
  startDate: Date;
  endDate: Date;
  type: string;
  roster: string;
  priority?: string;
  status?: string;
}
