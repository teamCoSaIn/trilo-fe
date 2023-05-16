import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

import HTTP from '@/api';
import { IDailyPlan, TTempPlanDayId } from '@/api/plan';
import { ISchedule } from '@/api/schedule';
import { ITrip } from '@/api/trip';

interface IMutateParams {
  tripId: ITrip['tripId'];
  scheduleId: ISchedule['scheduleId'];
  sourceDailyPlanId: IDailyPlan['dayId'] | TTempPlanDayId;
  sourceScheduleIdx: number;
  destinationDailyPlanId: IDailyPlan['dayId'] | TTempPlanDayId;
  destinationScheduleIdx: number;
}

const useChangeScheduleOrder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (params: IMutateParams) =>
      HTTP.changeScheduleOrder({
        scheduleId: params.scheduleId,
        destinationDailyPlanId: params.destinationDailyPlanId,
        destinationScheduleIdx: params.destinationScheduleIdx,
      }),
    {
      onMutate: async ({
        tripId,
        sourceDailyPlanId,
        sourceScheduleIdx,
        destinationDailyPlanId,
        destinationScheduleIdx,
      }: IMutateParams) => {
        await queryClient.cancelQueries([`dailyPlanList${tripId}`]);

        const previousDailyPlanList = queryClient.getQueryData<IDailyPlan[]>([
          `dailyPlanList${tripId}`,
        ]);

        if (previousDailyPlanList) {
          queryClient.setQueryData<IDailyPlan[]>(
            [`dailyPlanList${tripId}`],
            prevDailyPlanList => {
              if (!prevDailyPlanList) return prevDailyPlanList;

              // 1. 같은 Day 내에서 옮기는 경우
              if (sourceDailyPlanId === destinationDailyPlanId) {
                const nextDailyPlanList = produce(
                  prevDailyPlanList,
                  (draftDailyPlanList: IDailyPlan[]) => {
                    const targetDailyPlanIdx = draftDailyPlanList.findIndex(
                      dailyPlan => dailyPlan.dayId === sourceDailyPlanId
                    );
                    if (targetDailyPlanIdx === -1) return prevDailyPlanList;

                    const newSchedules = [
                      ...draftDailyPlanList[targetDailyPlanIdx].schedules,
                    ];
                    const [reorderedSchedule] = newSchedules.splice(
                      sourceScheduleIdx,
                      1
                    );
                    newSchedules.splice(
                      destinationScheduleIdx,
                      0,
                      reorderedSchedule
                    );
                    draftDailyPlanList[targetDailyPlanIdx].schedules =
                      newSchedules;
                  }
                );
                return nextDailyPlanList;
              }

              // 2. Day 간 이동
              const nextDailyPlanList = produce(
                prevDailyPlanList,
                draftDailyPlanList => {
                  const sourceDailyPlanIdx = draftDailyPlanList.findIndex(
                    dailyPlan => dailyPlan.dayId === sourceDailyPlanId
                  );
                  const destinationDailyPlanIdx = draftDailyPlanList.findIndex(
                    dailyPlan => dailyPlan.dayId === destinationDailyPlanId
                  );
                  if (
                    sourceDailyPlanIdx === -1 ||
                    destinationDailyPlanIdx === -1
                  )
                    return prevDailyPlanList;

                  const newSourceSchedules = [
                    ...draftDailyPlanList[sourceDailyPlanIdx].schedules,
                  ];
                  const newDestinationSchedules = [
                    ...draftDailyPlanList[destinationDailyPlanIdx].schedules,
                  ];
                  const [reorderedSchedule] = newSourceSchedules.splice(
                    sourceScheduleIdx,
                    1
                  );
                  newDestinationSchedules.splice(
                    destinationScheduleIdx,
                    0,
                    reorderedSchedule
                  );
                  draftDailyPlanList[sourceDailyPlanIdx].schedules =
                    newSourceSchedules;
                  draftDailyPlanList[destinationDailyPlanIdx].schedules =
                    newDestinationSchedules;
                }
              );

              return nextDailyPlanList;
            }
          );
        }

        return { previousDailyPlanList, tripId };
      },
      onError: (
        err,
        variables,
        context?: {
          previousDailyPlanList: IDailyPlan[] | undefined;
          tripId: ITrip['tripId'];
        }
      ) => {
        if (context?.previousDailyPlanList) {
          queryClient.setQueryData<IDailyPlan[]>(
            [`dailyPlanList${context.tripId}`],
            context.previousDailyPlanList
          );
        }
      },
    }
  );
};

export default useChangeScheduleOrder;
