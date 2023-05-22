import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import HTTP from '@/api';
import { ISchedule, IChangeScheduleDetailsParams } from '@/api/schedule';

const useChangeScheduleDetails = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: IChangeScheduleDetailsParams) => HTTP.changeScheduleDetails(data),
    {
      onMutate: async (data: IChangeScheduleDetailsParams) => {
        await queryClient.cancelQueries([`scheduleDetail${data.scheduleId}`]);

        const prevDetailsData = queryClient.getQueryData<ISchedule>([
          `scheduleDetail${data.scheduleId}`,
        ]);

        if (prevDetailsData) {
          queryClient.setQueryData<ISchedule>(
            [`scheduleDetail${data.scheduleId}`],
            prevData => {
              if (!prevData) {
                return;
              }
              const newData = produce(prevData, draftData => {
                if (data.title) {
                  draftData.title = data.title;
                }
                if (data.content) {
                  draftData.content = data.content;
                }
              });
              return newData;
            }
          );
        }

        return { prevDetailsData };
      },
      onError: (
        err,
        variables,
        context?: { prevDetailsData: ISchedule | undefined }
      ) => {
        if (context?.prevDetailsData) {
          queryClient.setQueryData<ISchedule>(
            [`scheduleDetail${variables.scheduleId}`],
            context.prevDetailsData
          );
        }
      },
    }
  );
};

export default useChangeScheduleDetails;
