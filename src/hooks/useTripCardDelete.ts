import { useMutation, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api/index';

const useTripCardDelete = () => {
  const queryClient = useQueryClient();

  return useMutation((id: number) => HTTP.deleteTripCard(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['tripList']);
    },
    onError: () => {
      alert('delete failed.');
    },
  });
};

export default useTripCardDelete;
