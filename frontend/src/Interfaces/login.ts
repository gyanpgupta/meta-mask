import { Auth } from './types';

export interface ILoginProps {
  onLoggedIn: (auth: Auth) => void;
}
