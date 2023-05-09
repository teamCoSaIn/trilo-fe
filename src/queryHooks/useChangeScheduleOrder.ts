import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

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
                const nextState = produce(
                  prevDayList,
                  (draftState: PlanDay[]) => {
                    const targetDayIdx = draftState.findIndex(
                      day => day.dayId === +sourceDayId
                    );
                    if (targetDayIdx === -1) return prevDayList;

                    const newSchedules = [
                      ...draftState[targetDayIdx].schedules,
                    ];
                    const [reorderedSchedule] = newSchedules.splice(
                      sourceDayScheduleIdx,
                      1
                    );
                    newSchedules.splice(
                      destinationDayScheduleIdx,
                      0,
                      reorderedSchedule
                    );
                    draftState[targetDayIdx].schedules = newSchedules;
                  }
                );
                return nextState;
              }

              // 2. Day 간 이동
              const nextState = produce(prevDayList, draftState => {
                const sourceDayIdx = draftState.findIndex(
                  day => day.dayId === +sourceDayId
                );
                const destinationDayIdx = draftState.findIndex(
                  day => day.dayId === +destinationDayId
                );
                if (sourceDayIdx === -1 || destinationDayIdx === -1)
                  return prevDayList;

                const newSourceSchedules = [
                  ...draftState[sourceDayIdx].schedules,
                ];
                const newDestinationSchedules = [
                  ...draftState[destinationDayIdx].schedules,
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
                draftState[sourceDayIdx].schedules = newSourceSchedules;
                draftState[destinationDayIdx].schedules =
                  newDestinationSchedules;
              });

              return nextState;
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
