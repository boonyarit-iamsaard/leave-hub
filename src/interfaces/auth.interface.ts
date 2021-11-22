import { User } from '@firebase/auth';
import { RosterType } from './roster.interface';

export enum AuthActionTypes {
  Login,
  Logout,
  SetIsAuthenticationReady,
}

export interface AuthAction {
  type: AuthActionTypes;
  payload: User | null;
}

export interface AuthState {
  isAuthenticationReady: boolean;
  user: User | null;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface Profile {
  entitled: number;
  firstName: string;
  isAdmin: boolean;
  lastName: string;
  roster: RosterType;
  tyc: number;
  uid: string;
  carryover?: number;
}
