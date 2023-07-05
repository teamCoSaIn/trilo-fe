import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { produce } from 'immer';
import { toast } from 'react-toastify';

import HTTP from '@/api';
import { IDailyPlan, IGetDailyPlanResponse } from '@/api/plan';
import { ITrip } from '@/api/trip';
import {
  DAILYPLAN_COLORS,
  TDailyPlanColorName,
} from '@/constants/dailyPlanColor';

interface IMutateParams {
  tripId: ITrip['tripId'];
  dayId: IDailyPlan['dayId'];
  colorName: TDailyPlanColorName;
}

const useChangeDayColor = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ dayId, colorName }: IMutateParams) =>
      HTTP.changeDayColor({ dayId, colorName }),
    {
      onMutate: async ({ dayId, tripId, colorName }: IMutateParams) => {
        await queryClient.cancelQueries([`dailyPlanList${tripId}`]);

        const prevDailyPlanData =
          queryClient.getQueryData<IGetDailyPlanResponse>([
            `dailyPlanList${tripId}`,
          ]);

        if (prevDailyPlanData) {
          queryClient.setQueryData<IGetDailyPlanResponse>(
            [`dailyPlanList${tripId}`],
            prevData => {
              if (!prevData) {
                return;
              }
              const newData = produce(prevData, draftData => {
                const targetDay = draftData.days.find(
                  day => day.dayId === dayId
                );
                if (!targetDay) {
                  return prevData;
                }
                targetDay.dayColor.name = colorName;
                targetDay.dayColor.code = DAILYPLAN_COLORS[colorName];
              });
              return newData;
            }
          );
        }

        return { prevDailyPlanData };
      },
      onError: (
        err: AxiosError<{
          errorCode?: string;
          errorDetail?: string;
          errorMessage?: string;
        }>,
        variables,
        context?: { prevDailyPlanData: IGetDailyPlanResponse | undefined }
      ) => {
        if (context?.prevDailyPlanData) {
          queryClient.setQueryData<IGetDailyPlanResponse>(
            [`dailyPlanList${variables.tripId}`],
            context.prevDailyPlanData
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

export default useChangeDayColor;
