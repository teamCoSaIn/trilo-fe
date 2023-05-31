import { atom, atomFamily } from 'recoil';

import { ISchedule } from '@/api/schedule';

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

export const PlaceInfo = atom<{ id: string; name: string }>({
  key: 'placeInfo',
  default: { id: '', name: '' },
});

export const SelectedScheduleId = atom<ISchedule['scheduleId']>({
  key: 'selectedScheduleId',
  default: undefined,
});
