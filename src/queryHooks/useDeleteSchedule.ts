import { useMutation, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api/index';
import { ISchedule } from '@/api/schedule';
import { ITrip } from '@/api/trip';

interface IMutateParams {
  tripId: ITrip['tripId'];
  scheduleId: ISchedule['scheduleId'];
}

const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ scheduleId }: IMutateParams) => HTTP.deleteSchedule(scheduleId),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([`dailyPlanList${variables.tripId}`]);
      },
      onError: () => {
        alert('delete failed.');
      },
    }
  );
};

export default useDeleteSchedule;
