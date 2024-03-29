import { useInfiniteQuery } from '@tanstack/react-query';

import HTTP from '@/api';
import { ITrip } from '@/api/trip';
import { SIZE_OF_TEMP_PLAN_PAGE } from '@/constants/tempPlan';

interface IUseGetTempPlanPageListParam {
  tripId: ITrip['tripId'];
  enabled?: boolean;
}

const useGetTempPlanPageList = ({
  tripId,
  enabled,
}: IUseGetTempPlanPageListParam) => {
  return useInfiniteQuery(
    [`tempPlanList${tripId}`],
    ({ pageParam = null }) => {
      return HTTP.getTempPlanList({
        tripId,
        scheduleId: pageParam,
        size: SIZE_OF_TEMP_PLAN_PAGE,
      });
    },
    {
      suspense: true,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      getNextPageParam: lastPage => {
        if (!lastPage.hasNext) {
          return undefined;
        }
        return lastPage.tempSchedules[lastPage.tempSchedules.length - 1]
          .scheduleId;
      },
      enabled,
    }
  );
};

export default useGetTempPlanPageList;
