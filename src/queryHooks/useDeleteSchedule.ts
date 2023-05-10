import { useMutation, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api/index';

interface MutateParams {
  tripId: string;
  scheduleId: number;
}

const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ scheduleId }: MutateParams) => HTTP.deleteSchedule(scheduleId),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([`dayList${variables.tripId}`]);
      },
      onError: () => {
        alert('delete failed.');
      },
    }
  );
};

export default useDeleteSchedule;
