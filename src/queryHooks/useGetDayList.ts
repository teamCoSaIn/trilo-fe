import { useQuery } from '@tanstack/react-query';

import HTTP from '@/api';
import { PlanDay } from '@/api/planDay';

interface UseGetDayListParam {
  tripId: string;
  onSuccess?: (data: PlanDay[]) => void;
  onError?: () => void;
}

const useGetDayList = ({ tripId, onSuccess, onError }: UseGetDayListParam) => {
  return useQuery([`dayList${tripId}`], () => HTTP.getPlanDayList(tripId), {
    onSuccess,
    onError,
    suspense: true,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 10,
  });
};

export default useGetDayList;
