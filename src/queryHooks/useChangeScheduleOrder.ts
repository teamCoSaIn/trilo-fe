import { useMutation, useQueryClient } from '@tanstack/react-query';
import { original, produce } from 'immer';

import HTTP from '@/api';
import { IDailyPlan, TScheduleSummary, TTempPlanDayId } from '@/api/plan';
import { ISchedule } from '@/api/schedule';
import { ITrip } from '@/api/trip';
import { TEMP_PLAN_ID } from '@/constants/tempPlan';

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
        destinationDailyPlanId:
          params.destinationDailyPlanId === TEMP_PLAN_ID
            ? null
            : params.destinationDailyPlanId,
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
        await queryClient.cancelQueries([`tempPlanList${tripId}`]);

        const previousDailyPlanList = queryClient.getQueryData<IDailyPlan[]>([
          `dailyPlanList${tripId}`,
        ]);

        const previousTempPlanList = queryClient.getQueryData<
          TScheduleSummary[]
        >([`tempPlanList${tripId}`]);

        // 임시보관함이 아닌 dailyPlan 내부 이동
        if (
          sourceDailyPlanId !== TEMP_PLAN_ID &&
          destinationDailyPlanId !== TEMP_PLAN_ID
        ) {
          queryClient.setQueryData<IDailyPlan[]>(
            [`dailyPlanList${tripId}`],
            prevDailyPlanList => {
              if (!prevDailyPlanList) {
                return prevDailyPlanList;
              }

              // 1. 같은 Day 내에서 옮기는 경우
              if (sourceDailyPlanId === destinationDailyPlanId) {
                const nextDailyPlanList = produce(
                  prevDailyPlanList,
                  draftDailyPlanList => {
                    const targetDailyPlan = draftDailyPlanList.find(
                      dailyPlan => dailyPlan.dayId === sourceDailyPlanId
                    );

                    if (!targetDailyPlan) {
                      return prevDailyPlanList;
                    }

                    const [reorderedSchedule] =
                      targetDailyPlan.schedules.splice(sourceScheduleIdx, 1);

                    targetDailyPlan.schedules.splice(
                      destinationScheduleIdx,
                      0,
                      reorderedSchedule
                    );
                  }
                );

                return nextDailyPlanList;
              }

              // 2. Day 간 이동
              const nextDailyPlanList = produce(
                prevDailyPlanList,
                draftDailyPlanList => {
                  const sourceDailyPlan = draftDailyPlanList.find(
                    dailyPlan => dailyPlan.dayId === sourceDailyPlanId
                  );
                  const destinationDailyPlan = draftDailyPlanList.find(
                    dailyPlan => dailyPlan.dayId === destinationDailyPlanId
                  );

                  if (!sourceDailyPlan || !destinationDailyPlan) {
                    return prevDailyPlanList;
                  }

                  const [reorderedSchedule] = sourceDailyPlan.schedules.splice(
                    sourceScheduleIdx,
                    1
                  );

                  destinationDailyPlan.schedules.splice(
                    destinationScheduleIdx,
                    0,
                    reorderedSchedule
                  );
                }
              );

              return nextDailyPlanList;
            }
          );
        }

        // dailyPlan -> 임시보관함
        if (
          sourceDailyPlanId !== TEMP_PLAN_ID &&
          destinationDailyPlanId === TEMP_PLAN_ID
        ) {
          let reorderedSchedule: TScheduleSummary | undefined;

          queryClient.setQueryData<IDailyPlan[]>(
            [`dailyPlanList${tripId}`],
            prevDailyPlanList => {
              if (!prevDailyPlanList) {
                return prevDailyPlanList;
              }

              const nextDailyPlanList = produce(
                prevDailyPlanList,
                draftDailyPlanList => {
                  const sourceDailyPlan = draftDailyPlanList.find(
                    dailyPlan => dailyPlan.dayId === sourceDailyPlanId
                  );
                  if (!sourceDailyPlan) {
                    return prevDailyPlanList;
                  }

                  const [extractedSchedule] = sourceDailyPlan.schedules.splice(
                    sourceScheduleIdx,
                    1
                  );
                  reorderedSchedule = original(extractedSchedule);
                }
              );

              return nextDailyPlanList;
            }
          );

          queryClient.setQueryData<TScheduleSummary[]>(
            [`tempPlanList${tripId}`],
            prevTempPlanList => {
              if (!prevTempPlanList) {
                return prevTempPlanList;
              }
              const nextTempPlanList = produce(
                prevTempPlanList,
                draftTempPlanList => {
                  if (!reorderedSchedule) {
                    return prevTempPlanList;
                  }

                  draftTempPlanList.splice(
                    destinationScheduleIdx,
                    0,
                    reorderedSchedule
                  );
                }
              );

              return nextTempPlanList;
            }
          );
        }

        // 임시보관함 -> dailyPlan
        if (
          sourceDailyPlanId === TEMP_PLAN_ID &&
          destinationDailyPlanId !== TEMP_PLAN_ID
        ) {
          let reorderedSchedule: TScheduleSummary | undefined;

          queryClient.setQueryData<TScheduleSummary[]>(
            [`tempPlanList${tripId}`],
            prevTempPlanList => {
              if (!prevTempPlanList) {
                return prevTempPlanList;
              }

              const nextTempPlanList = produce(
                prevTempPlanList,
                draftTempPlanList => {
                  const [extractedSchedule] = draftTempPlanList.splice(
                    sourceScheduleIdx,
                    1
                  );
                  reorderedSchedule = original(extractedSchedule);
                }
              );

              return nextTempPlanList;
            }
          );

          queryClient.setQueryData<IDailyPlan[]>(
            [`dailyPlanList${tripId}`],
            prevDailyPlanList => {
              if (!prevDailyPlanList) {
                return prevDailyPlanList;
              }

              const nextDailyPlanList = produce(
                prevDailyPlanList,
                draftDailyPlanList => {
                  const destinationDailyPlan = draftDailyPlanList.find(
                    dailyPlan => dailyPlan.dayId === destinationDailyPlanId
                  );

                  if (!destinationDailyPlan || !reorderedSchedule) {
                    return prevDailyPlanList;
                  }

                  destinationDailyPlan.schedules.splice(
                    destinationScheduleIdx,
                    0,
                    reorderedSchedule
                  );
                }
              );

              return nextDailyPlanList;
            }
          );
        }

        // 임시보관함 -> 임시보관함
        if (
          sourceDailyPlanId === TEMP_PLAN_ID &&
          destinationDailyPlanId === TEMP_PLAN_ID
        ) {
          queryClient.setQueryData<TScheduleSummary[]>(
            [`tempPlanList${tripId}`],
            prevTempPlanList => {
              if (!prevTempPlanList) {
                return prevTempPlanList;
              }

              const nextTempPlanList = produce(
                prevTempPlanList,
                draftTempPlanList => {
                  const [reorderedSchedule] = draftTempPlanList.splice(
                    sourceScheduleIdx,
                    1
                  );

                  draftTempPlanList.splice(
                    destinationScheduleIdx,
                    0,
                    reorderedSchedule
                  );
                }
              );

              return nextTempPlanList;
            }
          );
        }

        return { previousDailyPlanList, previousTempPlanList, tripId };
      },
      onError: (
        err,
        variables,
        context?: {
          previousDailyPlanList: IDailyPlan[] | undefined;
          previousTempPlanList: TScheduleSummary[] | undefined;
          tripId: ITrip['tripId'];
        }
      ) => {
        if (context?.previousDailyPlanList) {
          queryClient.setQueryData<IDailyPlan[]>(
            [`dailyPlanList${context.tripId}`],
            context.previousDailyPlanList
          );
        }
        if (context?.previousTempPlanList) {
          queryClient.setQueryData<TScheduleSummary[]>(
            [`tempPlanList${context.tripId}`],
            context.previousTempPlanList
          );
        }
      },
    }
  );
};

export default useChangeScheduleOrder;
