import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

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
  });
};

export default useDeleteTrip;
