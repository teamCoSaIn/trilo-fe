import { useMutation, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api';
import { PlanDay } from '@/api/planDay';

interface MutateParams {
  tripId: string;
  scheduleId: string;
  sourceDayId: string;
  sourceDayScheduleIdx: number;
  destinationDayId: string;
  destinationDayScheduleIdx: number;
}
const useChangeScheduleOrder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (params: MutateParams) =>
      HTTP.changeScheduleOrder({
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
      }: MutateParams) => {
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
                  day => day.dayId === +sourceDayId
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

              // 2. Day 간 이동
              if (sourceDayId !== destinationDayId) {
                const newDayList = [...prevDayList];
                const sourceDayIdx = newDayList.findIndex(
                  day => day.dayId === +sourceDayId
                );
                const destinationDayIdx = newDayList.findIndex(
                  day => day.dayId === +destinationDayId
                );
                if (sourceDayIdx === -1 || destinationDayIdx === -1)
                  return prevDayList;

                const newSourceSchedules = [
                  ...newDayList[sourceDayIdx].schedules,
                ];
                const newDestinationSchedules = [
                  ...newDayList[destinationDayIdx].schedules,
                ];
                const [reorderedSchedule] = newSourceSchedules.splice(
                  sourceDayScheduleIdx,
                  1
                );
                newDestinationSchedules.splice(
                  destinationDayScheduleIdx,
                  0,
                  reorderedSchedule
                );
                newDayList[sourceDayIdx].schedules = newSourceSchedules;
                newDayList[destinationDayIdx].schedules =
                  newDestinationSchedules;

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

export default useChangeScheduleOrder;
