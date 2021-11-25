import { User } from '@firebase/auth';
import { RosterType } from './roster.interface';

export enum AuthActionType {
  Login,
  Logout,
  SetIsAuthenticationReady,
  SetProfile,
}

export interface AuthAction {
  type: AuthActionType;
  payload?: {
    profile?: Profile | null;
    user?: User | null;
  };
}

export interface AuthState {
  isAuthenticationReady: boolean;
  profile: Profile | null;
  user: User | null;
}

export interface UserCredential {
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
