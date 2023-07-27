import { atom } from 'recoil';
import { IAuthState } from '../Interface/GlobalState';

const AuthState = atom<Partial<IAuthState>>({
  key: 'Authentication',
  default: { type: 'default', status: 'Who are you?', toggle: false },
});

export { AuthState };
