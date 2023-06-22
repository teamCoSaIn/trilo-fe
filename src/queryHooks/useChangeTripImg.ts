import { useMutation, useQueryClient } from '@tanstack/react-query';

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
    }
  );
};

export default useChangeTripImg;
