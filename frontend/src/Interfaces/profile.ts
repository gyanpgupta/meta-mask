import { Auth } from './types';

export interface IProfileProps {
  auth: Auth;
  onLoggedOut: () => void;
}

export interface IProfileState {
  loading: boolean;
  user?: {
    id: number;
    username: string;
  };
  username: string;
}

export interface JwtDecoded {
  payload: {
    id: string;
    publicAddress: string;
  };
}
