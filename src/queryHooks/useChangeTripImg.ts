import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import HTTP from '@/api';
import { IChangeTripImageParams } from '@/api/trip';

const useChangeTripImg = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (imgData: IChangeTripImageParams) => HTTP.changeTripImg(imgData),
    {
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
    }
  );
};

export default useChangeTripImg;
