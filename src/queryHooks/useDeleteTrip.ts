import { useMutation, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api/index';

const useDeleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation((id: number) => HTTP.deleteTrip(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['tripList']);
    },
    onError: () => {
      alert('delete failed.');
    },
  });
};

export default useDeleteTrip;
