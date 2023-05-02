import { atomFamily } from 'recoil';

export const DropdownMenuFamily = atomFamily<string[], string>({
  key: 'dropdownMenu',
  default: ['전체일정'],
});

export const DropdownIndexFamily = atomFamily<number, string>({
  key: 'dropdownIndex',
  default: 0,
});
