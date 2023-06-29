import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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
          alert(err.response.data.errorDetail);
        } else {
          alert('server error');
        }
      },
    }
  );
};

export default useChangeTripImg;
