import { atom, atomFamily } from 'recoil';

import { ISchedule } from '@/api/schedule';
import { TDailyPlanColorName } from '@/constants/dailyPlanColor';

interface IMenu {
  dailyPlanId: number;
  name: string;
  date: string;
  colorName: TDailyPlanColorName;
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

export const SelectedEditorScheduleId = atom<ISchedule['scheduleId']>({
  key: 'selectedEditorScheduleId',
  default: undefined,
});

export const SelectedMarkerScheduleId = atom<ISchedule['scheduleId']>({
  key: 'selectedMarkerScheduleId',
  default: undefined,
});

export const IsTempBoxOpen = atom<boolean>({
  key: 'isTempBoxOpen',
  default: false,
});
