import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import HTTP from '@/api/index';
import { TDeleteTripParams } from '@/api/trip';

const useDeleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation((id: TDeleteTripParams) => HTTP.deleteTrip(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['tripList']);
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
  });
};

export default useDeleteTrip;
