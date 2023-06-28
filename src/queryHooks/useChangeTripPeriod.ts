import { useMutation, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api';
import { TChangeTripPeriodParams } from '@/api/trip';

const useChangeTripPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (periodData: TChangeTripPeriodParams) => HTTP.changeTripPeriod(periodData),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([`tripList`]);
        queryClient.invalidateQueries([`trip${variables.tripId}`]);
        queryClient.invalidateQueries([`dailyPlanList${variables.tripId}`]);
        queryClient.invalidateQueries([`tempPlanList${variables.tripId}`]);
      },
    }
  );
};

export default useChangeTripPeriod;
