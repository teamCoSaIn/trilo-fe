import { useQuery } from '@tanstack/react-query';

import HTTP from '@/api';
import { IDailyPlan } from '@/api/plan';

interface IUseGetDailyPlanListParam {
  tripId: string;
  onSuccess?: (data: IDailyPlan[]) => void;
  onError?: () => void;
}

const useGetDailyPlanList = ({
  tripId,
  onSuccess,
  onError,
}: IUseGetDailyPlanListParam) => {
  return useQuery(
    [`dailyPlanList${tripId}`],
    () => HTTP.getDailyPlanList(tripId),
    {
      onSuccess,
      onError,
      suspense: true,
      staleTime: Infinity,
      cacheTime: 1000 * 60 * 10,
    }
  );
};

export default useGetDailyPlanList;
