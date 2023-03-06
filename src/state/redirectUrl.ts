import { atom } from 'recoil';

const RedirectUrl = atom<string>({
  key: 'RedirectUrl',
  default: '/',
});

export default RedirectUrl;
