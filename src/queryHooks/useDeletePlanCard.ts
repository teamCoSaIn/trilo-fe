import { useMutation, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api/index';

const useDeletePlanCard = () => {
  const queryClient = useQueryClient();

  return useMutation((id: number) => HTTP.deletePlanCard(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['planCardList']);
    },
    onError: () => {
      alert('delete failed.');
    },
  });
};

export default useDeletePlanCard;
