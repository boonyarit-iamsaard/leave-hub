import { format } from 'date-fns';

export const transformTimestamp = (date: number): string =>
  format(new Date(date), 'yyyy-MM-dd HH:mm');
