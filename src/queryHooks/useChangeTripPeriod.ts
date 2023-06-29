import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import HTTP from '@/api';
import { TChangeTripPeriodParams } from '@/api/trip';

const useChangeTripPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (periodData: TChangeTripPeriodParams) => HTTP.changeTripPeriod(periodData),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([`trip${variables.tripId}`]);
        queryClient.invalidateQueries([`dailyPlanList${variables.tripId}`]);
        queryClient.invalidateQueries([`tempPlanList${variables.tripId}`]);
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

export default useChangeTripPeriod;
