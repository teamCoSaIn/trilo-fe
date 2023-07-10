import { atom } from 'recoil';

export const IsSideMenuOpen = atom<boolean>({
  key: 'isSideMenuOpen',
  default: false,
});
