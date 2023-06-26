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
                draftData.title = data.title;
                draftData.content = data.content;
                draftData.scheduleTime = {
                  startTime: data.startTime,
                  endTime: data.endTime,
                };
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
