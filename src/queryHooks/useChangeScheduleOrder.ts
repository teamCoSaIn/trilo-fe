/* eslint-disable no-plusplus */
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { original, produce } from 'immer';
import { toast } from 'react-toastify';

import HTTP from '@/api';
import {
  IDailyPlan,
  IGetDailyPlanResponse,
  ITempPlan,
  TScheduleSummary,
  TTempPlanDayId,
} from '@/api/plan';
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
  size: number;
}

// TODO: 중복 코드들 분리

const useChangeScheduleOrder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (params: IMutateParams) => {
      let isDiff = false;

      if (
        params.sourceDailyPlanId === params.destinationDailyPlanId &&
        params.sourceScheduleIdx < params.destinationScheduleIdx
      ) {
        isDiff = true;
      }

      return HTTP.changeScheduleOrder({
        scheduleId: params.scheduleId,
        destinationDailyPlanId:
          params.destinationDailyPlanId === TEMP_PLAN_ID
            ? null
            : params.destinationDailyPlanId,
        destinationScheduleIdx: isDiff
          ? params.destinationScheduleIdx + 1
          : params.destinationScheduleIdx,
      });
    },
    {
      onMutate: async ({
        tripId,
        scheduleId,
        sourceDailyPlanId,
        sourceScheduleIdx,
        destinationDailyPlanId,
        destinationScheduleIdx,
        size,
      }: IMutateParams) => {
        queryClient.invalidateQueries([`scheduleDetail${scheduleId}`]);

        await queryClient.cancelQueries([`dailyPlanList${tripId}`]);
        await queryClient.cancelQueries([`tempPlanList${tripId}`]);

        const previousDailyPlanList =
          queryClient.getQueryData<IGetDailyPlanResponse>([
            `dailyPlanList${tripId}`,
          ]);
        const previousTempPlanList = queryClient.getQueryData<
          InfiniteData<ITempPlan>
        >([`tempPlanList${tripId}`]);

        // dailyPlan -> dailyPlan
        if (
          sourceDailyPlanId !== TEMP_PLAN_ID &&
          destinationDailyPlanId !== TEMP_PLAN_ID
        ) {
          queryClient.setQueryData<IGetDailyPlanResponse>(
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
                    const targetDailyPlan = draftDailyPlanList.days.find(
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
                  const sourceDailyPlan = draftDailyPlanList.days.find(
                    dailyPlan => dailyPlan.dayId === sourceDailyPlanId
                  );
                  const destinationDailyPlan = draftDailyPlanList.days.find(
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
          // 이동할 스케줄
          let reorderedSchedule: TScheduleSummary | undefined;

          // 기존 영역에서 해당 스케줄 제거
          queryClient.setQueryData<IGetDailyPlanResponse>(
            [`dailyPlanList${tripId}`],
            prevDailyPlanList => {
              if (!prevDailyPlanList) {
                return prevDailyPlanList;
              }

              const nextDailyPlanList = produce(
                prevDailyPlanList,
                draftDailyPlanList => {
                  const sourceDailyPlan = draftDailyPlanList.days.find(
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

          // 이동할 영역에 해당 스케줄 추가
          queryClient.setQueryData<InfiniteData<ITempPlan>>(
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

                  // 일정 병합
                  const tempPlanSchedules = prevTempPlanList.pages.reduce(
                    (accSchedules: TScheduleSummary[], currPage: ITempPlan) => {
                      accSchedules.push(...currPage.tempSchedules);
                      return accSchedules;
                    },
                    []
                  );

                  // 이동된 일정 추가
                  tempPlanSchedules.splice(
                    destinationScheduleIdx,
                    0,
                    reorderedSchedule
                  );

                  const numOfPages = Math.ceil(tempPlanSchedules.length / size);

                  for (let i = 0; i < numOfPages; i++) {
                    draftTempPlanList.pages[i] = {
                      // tempPlanSchedules 처리
                      tempSchedules: tempPlanSchedules.slice(
                        i * size,
                        (i + 1) * size
                      ),
                      // hasNext 처리
                      hasNext:
                        i === numOfPages - 1
                          ? prevTempPlanList.pages[
                              prevTempPlanList.pages.length - 1
                            ].hasNext
                          : true,
                    };
                  }
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
          // 이동할 스케줄
          let reorderedSchedule: TScheduleSummary | undefined;

          // 기존 영역에서 해당 스케줄 제거
          queryClient.setQueryData<InfiniteData<ITempPlan>>(
            [`tempPlanList${tripId}`],
            prevTempPlanList => {
              if (!prevTempPlanList) {
                return prevTempPlanList;
              }

              const nextTempPlanList = produce(
                prevTempPlanList,
                draftTempPlanList => {
                  // 일정 병합
                  const tempPlanSchedules = draftTempPlanList.pages.reduce(
                    (accSchedules: TScheduleSummary[], currPage: ITempPlan) => {
                      accSchedules.push(...currPage.tempSchedules);
                      return accSchedules;
                    },
                    []
                  );

                  // 이동할 일정 추출
                  const [extractedSchedule] = tempPlanSchedules.splice(
                    sourceScheduleIdx,
                    1
                  );
                  reorderedSchedule = original(extractedSchedule);

                  const numOfPages = tempPlanSchedules.length
                    ? Math.ceil(tempPlanSchedules.length / size)
                    : 1;

                  draftTempPlanList.pages.length = 0;

                  for (let i = 0; i < numOfPages; i++) {
                    draftTempPlanList.pages[i] = {
                      // tempPlanSchedules 처리
                      tempSchedules: tempPlanSchedules.slice(
                        i * size,
                        (i + 1) * size
                      ),
                      // hasNext 처리
                      hasNext:
                        i === numOfPages - 1
                          ? prevTempPlanList.pages[
                              prevTempPlanList.pages.length - 1
                            ].hasNext
                          : true,
                    };
                  }
                }
              );

              return nextTempPlanList;
            }
          );

          // 이동할 영역에 해당 스케줄 추가
          queryClient.setQueryData<IGetDailyPlanResponse>(
            [`dailyPlanList${tripId}`],
            prevDailyPlanList => {
              if (!prevDailyPlanList) {
                return prevDailyPlanList;
              }

              const nextDailyPlanList = produce(
                prevDailyPlanList,
                draftDailyPlanList => {
                  const destinationDailyPlan = draftDailyPlanList.days.find(
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
          queryClient.setQueryData<InfiniteData<ITempPlan>>(
            [`tempPlanList${tripId}`],
            prevTempPlanList => {
              if (!prevTempPlanList) {
                return prevTempPlanList;
              }

              const nextTempPlanList = produce(
                prevTempPlanList,
                draftTempPlanList => {
                  const tempPlanSchedules = draftTempPlanList.pages.reduce(
                    (accSchedules: TScheduleSummary[], currPage: ITempPlan) => {
                      accSchedules.push(...currPage.tempSchedules);
                      return accSchedules;
                    },
                    []
                  );

                  const [reorderedSchedule] = tempPlanSchedules.splice(
                    sourceScheduleIdx,
                    1
                  );

                  tempPlanSchedules.splice(
                    destinationScheduleIdx,
                    0,
                    reorderedSchedule
                  );

                  for (let i = 0; i < draftTempPlanList.pages.length; i++) {
                    draftTempPlanList.pages[i].tempSchedules =
                      tempPlanSchedules.slice(i * size, (i + 1) * size);
                  }
                }
              );

              return nextTempPlanList;
            }
          );
        }

        return { previousDailyPlanList, previousTempPlanList, tripId };
      },
      onError: (
        err: AxiosError<{
          errorCode?: string;
          errorDetail?: string;
          errorMessage?: string;
        }>,
        variables,
        context?: {
          previousDailyPlanList: IGetDailyPlanResponse | undefined;
          previousTempPlanList: InfiniteData<ITempPlan> | undefined;
          tripId: ITrip['tripId'];
        }
      ) => {
        if (context?.previousDailyPlanList) {
          queryClient.setQueryData<IGetDailyPlanResponse>(
            [`dailyPlanList${context.tripId}`],
            context.previousDailyPlanList
          );
        }
        if (context?.previousTempPlanList) {
          queryClient.setQueryData<InfiniteData<ITempPlan>>(
            [`tempPlanList${context.tripId}`],
            context.previousTempPlanList
          );
        }
        if (err.response?.data?.errorDetail) {
          toast.error(err.response.data.errorDetail, {
            autoClose: 3000,
            pauseOnHover: false,
            draggable: false,
          });
        } else {
          toast.error('Server Error', {
            autoClose: 3000,
            pauseOnHover: false,
            draggable: false,
          });
        }
      },
    }
  );
};

export default useChangeScheduleOrder;
