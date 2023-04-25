import { atom } from 'recoil';

const SelectedDates = atom<[Date | null, Date | null]>({
  key: 'selectedDates',
  default: [null, null],
});

export default SelectedDates;
