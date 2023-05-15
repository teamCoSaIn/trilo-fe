import { useMutation, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api/index';
import { TDeleteTripTitleParams } from '@/api/trip';

const useDeleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation((id: TDeleteTripTitleParams) => HTTP.deleteTrip(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['tripList']);
    },
    onError: () => {
      alert('delete failed.');
    },
  });
};

export default useDeleteTrip;
