import { useQuery } from '@tanstack/react-query';

import HTTP from '@/api';

const useGetDayList = (planId: string) => {
  return useQuery(['dayList'], () => HTTP.getPlanDayList(planId));
};

export default useGetDayList;
