import { useMutation, useQueryClient } from '@tanstack/react-query';

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
          queryClient.invalidateQueries([`tempPlanList1${variables.tripId}`]);
        }
      },
      onError: () => {
        alert('delete failed.');
      },
    }
  );
};

export default useDeleteSchedule;
