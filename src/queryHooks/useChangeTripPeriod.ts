import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

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
      onError: (
        err: AxiosError<{
          errorCode?: string;
          errorDetail?: string;
          errorMessage?: string;
        }>
      ) => {
        if (err.response?.data?.errorDetail) {
          toast.error(err.response.data.errorDetail, {
            autoClose: 3000,
            pauseOnHover: false,
            draggable: false,
          });
        } else {
          toast.error('Server Error', {
            autoClose: 3000,
            pauseOnHover: false,
            draggable: false,
          });
        }
      },
    }
  );
};

export default useChangeTripPeriod;
