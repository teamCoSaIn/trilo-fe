import { useQuery } from '@tanstack/react-query';

import HTTP from '@/api';
import { PlanDay } from '@/api/planDay';

interface UseGetDayListParam {
  planId: string;
  onSuccess?: (data: PlanDay[]) => void;
  onError?: () => void;
}

const useGetDayList = ({ planId, onSuccess, onError }: UseGetDayListParam) => {
  return useQuery([`dayList${planId}`], () => HTTP.getPlanDayList(planId), {
    onSuccess,
    onError,
    suspense: true,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 10,
  });
};

export default useGetDayList;
