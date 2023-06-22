import { atom, selector } from 'recoil';

const SelectedDates = atom<[Date | null, Date | null]>({
  key: 'selectedDates',
  default: [null, null],
});

export const IsPeriodOver10Days = selector({
  key: 'isPeriodOver10Days',
  get: ({ get }) => {
    const [startDate, endDate] = get(SelectedDates);
    return (
      !!startDate &&
      !!endDate &&
      endDate.getTime() - startDate.getTime() >= 10 * 24 * 60 * 60 * 1000
    );
  },
});

export default SelectedDates;
