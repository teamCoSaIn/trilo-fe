import { atom } from 'recoil';

const AccessToken = atom<string>({
  key: 'AccessToken',
  default: '',
});

export default AccessToken;
