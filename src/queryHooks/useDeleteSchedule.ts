import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import HTTP from '@/api/index';
import { IDailyPlan } from '@/api/plan';
import { ISchedule } from '@/api/schedule';
import { ITrip } from '@/api/trip';

interface IMutateParams {
  tripId: ITrip['tripId'];
  scheduleId: ISchedule['scheduleId'];
  dayId: IDailyPlan['dayId'];
}

const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ scheduleId }: IMutateParams) => HTTP.deleteSchedule(scheduleId),
    {
      onSuccess: (_, variables) => {
        if (variables.dayId >= 0) {
          queryClient.invalidateQueries([`dailyPlanList${variables.tripId}`]);
        } else {
          queryClient.invalidateQueries([`tempPlanList${variables.tripId}`]);
        }
      },
      onError: (
        err: AxiosError<{
          errorCode?: string;
          errorDetail?: string;
          errorMessage?: string;
        }>
      ) => {
        if (err.response?.data?.errorDetail) {
          alert(err.response.data.errorDetail);
        } else {
          alert('server error');
        }
      },
    }
  );
};

export default useDeleteSchedule;
