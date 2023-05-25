import { useMutation, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api';

const useChangeTripImg = () => {
  const queryClient = useQueryClient();

  return useMutation((imgData: FormData) => HTTP.changeTripImg(imgData), {
    onSuccess: () => {
      queryClient.invalidateQueries(['tripList']);
    },
  });
};

export default useChangeTripImg;
