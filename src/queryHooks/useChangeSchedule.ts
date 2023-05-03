import { useMutation, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api';
import { PlanDay } from '@/api/planDay';

interface ChangeScheduleMutationParams {
  tripId: string;
  scheduleId: string;
  sourceDayId: string;
  sourceDayScheduleIdx: number;
  destinationDayId: string;
  destinationDayScheduleIdx: number;
}
const useChangeSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (params: ChangeScheduleMutationParams) =>
      HTTP.changeSchedule({
        scheduleId: params.scheduleId,
        destinationDayId: params.destinationDayId,
        destinationDayIdx: params.destinationDayScheduleIdx,
      }),
    {
      onMutate: async ({
        tripId,
        sourceDayId,
        sourceDayScheduleIdx,
        destinationDayId,
        destinationDayScheduleIdx,
      }: ChangeScheduleMutationParams) => {
        await queryClient.cancelQueries([`dayList${tripId}`]);

        const previousDayList = queryClient.getQueryData<PlanDay[]>([
          `dayList${tripId}`,
        ]);

        if (previousDayList) {
          queryClient.setQueryData<PlanDay[]>(
            [`dayList${tripId}`],
            prevDayList => {
              if (!prevDayList) return prevDayList;

              // 1. 같은 Day 내에서 옮기는 경우
              if (sourceDayId === destinationDayId) {
                const newDayList = [...prevDayList];
                const targetDayIdx = newDayList.findIndex(
                  x => x.dayId === +sourceDayId
                );
                if (targetDayIdx === -1) return prevDayList;
                const newSchedules = [...newDayList[targetDayIdx].schedules];
                const [reorderedSchedule] = newSchedules.splice(
                  sourceDayScheduleIdx,
                  1
                );
                newSchedules.splice(
                  destinationDayScheduleIdx,
                  0,
                  reorderedSchedule
                );
                newDayList[targetDayIdx].schedules = newSchedules;
                return newDayList;
              }

              return prevDayList;
            }
          );
        }

        return { previousDayList, tripId };
      },
      onError: (
        err,
        variables,
        context?: { previousDayList: PlanDay[] | undefined; tripId: string }
      ) => {
        if (context?.previousDayList) {
          queryClient.setQueryData<PlanDay[]>(
            [`dayList${context.tripId}`],
            context.previousDayList
          );
        }
      },
    }
  );
};

export default useChangeSchedule;
