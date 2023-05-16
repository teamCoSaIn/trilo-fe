import { useQuery } from '@tanstack/react-query';

import HTTP from '@/api';
import { TScheduleSummary } from '@/api/plan';
import { ITrip } from '@/api/trip';
import { TEMP_PLAN_COLOR, TEMP_PLAN_ID } from '@/constants/tempPlan';

interface ITempPlanSelect {
  dayId: number;
  color: string;
  schedules: TScheduleSummary[];
}

interface IUseGetTempPlanListParam {
  tripId: ITrip['tripId'];
  onSuccess?: (data: ITempPlanSelect) => void;
  onError?: () => void;
}

const useGetTempPlanList = ({
  tripId,
  onSuccess,
  onError,
}: IUseGetTempPlanListParam) => {
  return useQuery(
    [`tempPlanList${tripId}`],
    async () => HTTP.getTempPlanList(tripId),
    {
      onSuccess,
      onError,
      suspense: true,
      staleTime: Infinity,
      cacheTime: 1000 * 60 * 10,
      select: data => ({
        dayId: TEMP_PLAN_ID,
        color: TEMP_PLAN_COLOR,
        schedules: data,
      }),
    }
  );
};

export default useGetTempPlanList;
