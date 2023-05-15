import { atom, atomFamily } from 'recoil';

interface IMenu {
  dailyPlanId: number;
  name: string;
  date: string;
  color: string;
}

export const DropdownMenuFamily = atomFamily<IMenu[], string>({
  key: 'dropdownMenu',
  default: [],
});

export const DropdownIndexFamily = atomFamily<number, string>({
  key: 'dropdownIndex',
  default: -1,
});

export const PlaceName = atom<string>({
  key: 'placeName',
  default: '',
});
