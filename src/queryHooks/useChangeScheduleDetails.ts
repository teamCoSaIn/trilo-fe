import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { produce } from 'immer';

import HTTP from '@/api';
import {
  IDailyPlan,
  IGetDailyPlanResponse,
  ITempPlan,
  TTempPlanDayId,
} from '@/api/plan';
import { ISchedule, IChangeScheduleDetailsParams } from '@/api/schedule';
import { ITrip } from '@/api/trip';

interface IMutateParams extends IChangeScheduleDetailsParams {
  tripId: ITrip['tripId'];
  dayId: IDailyPlan['dayId'] | TTempPlanDayId;
}

const useChangeScheduleDetails = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: IChangeScheduleDetailsParams) => HTTP.changeScheduleDetails(data),
    {
      onMutate: async ({
        tripId,
        dayId,
        scheduleId,
        title,
        content,
        startTime,
        endTime,
      }: IMutateParams) => {
        await queryClient.cancelQueries([`scheduleDetail${scheduleId}`]);

        const prevDetailsData = queryClient.getQueryData<ISchedule>([
          `scheduleDetail${scheduleId}`,
        ]);

        if (prevDetailsData) {
          queryClient.setQueryData<ISchedule>(
            [`scheduleDetail${scheduleId}`],
            prevData => {
              if (!prevData) {
                return;
              }
              const newData = produce(prevData, draftData => {
                draftData.title = title;
                draftData.content = content;
                draftData.scheduleTime = {
                  startTime,
                  endTime,
                };
              });
              return newData;
            }
          );
        }

        if (prevDetailsData?.title !== title) {
          if (dayId) {
            await queryClient.cancelQueries([`dailyPlanList${tripId}`]);

            const previousDailyPlanList =
              queryClient.getQueryData<IGetDailyPlanResponse>([
                `dailyPlanList${tripId}`,
              ]);

            if (previousDailyPlanList) {
              queryClient.setQueryData<IGetDailyPlanResponse>(
                [`dailyPlanList${tripId}`],
                prevDailyPlanList => {
                  if (!prevDailyPlanList) {
                    return prevDailyPlanList;
                  }

                  const nextDailyPlanList = produce(
                    prevDailyPlanList,
                    draftDailyPlanList => {
                      draftDailyPlanList.days.forEach((day, dayIdx) => {
                        day.schedules.forEach((schedule, scheduleIdx) => {
                          if (schedule.scheduleId === scheduleId) {
                            draftDailyPlanList.days[dayIdx].schedules[
                              scheduleIdx
                            ].title = title;
                          }
                        });
                      });
                    }
                  );
                  return nextDailyPlanList;
                }
              );
            }

            return {
              prevDetailsData,
              previousDailyPlanList,
              tripId,
            };
          }
          await queryClient.cancelQueries([`tempPlanList${tripId}`]);

          const previousTempPlanList = queryClient.getQueryData<
            InfiniteData<ITempPlan>
          >([`tempPlanList${tripId}`]);

          if (previousTempPlanList) {
            queryClient.setQueryData<InfiniteData<ITempPlan>>(
              [`tempPlanList${tripId}`],
              prevTempPlanList => {
                if (!prevTempPlanList) {
                  return prevTempPlanList;
                }

                const nextTempPlanList = produce(
                  prevTempPlanList,
                  draftTempPlanList => {
                    draftTempPlanList.pages.forEach((page, pageIdx) => {
                      page.tempSchedules.forEach((schedule, scheduleIdx) => {
                        if (schedule.scheduleId === scheduleId) {
                          draftTempPlanList.pages[pageIdx].tempSchedules[
                            scheduleIdx
                          ].title = title;
                        }
                      });
                    });
                  }
                );
                return nextTempPlanList;
              }
            );
          }

          return {
            prevDetailsData,
            previousTempPlanList,
            tripId,
          };
        }

        return { prevDetailsData };
      },
      onError: (
        err,
        variables,
        context?: {
          prevDetailsData: ISchedule | undefined;
          previousDailyPlanList?: IGetDailyPlanResponse | undefined;
          previousTempPlanList?: InfiniteData<ITempPlan> | undefined;
          tripId?: ITrip['tripId'];
        }
      ) => {
        if (context?.prevDetailsData) {
          queryClient.setQueryData<ISchedule>(
            [`scheduleDetail${variables.scheduleId}`],
            context.prevDetailsData
          );
        }
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
      },
    }
  );
};

export default useChangeScheduleDetails;
