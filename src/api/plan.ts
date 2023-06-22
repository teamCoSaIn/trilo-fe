/* eslint-disable import/no-cycle */
import axios from '@/api/core';
import { ISchedule } from '@/api/schedule';
import { ITrip } from '@/api/trip';
import { TDailyPlanColorName } from '@/constants/dailyPlanColor';

interface IDailyPlanColor {
  name: TDailyPlanColorName;
  code: string;
}

export interface IDailyPlan {
  tripId: ITrip['tripId'];
  dayId: number;
  date: string;
  color: IDailyPlanColor;
  schedules: TScheduleSummary[];
}

export interface IGetDailyPlanResponse {
  days: IDailyPlan[];
}

export interface ITempPlan {
  tempSchedules: TScheduleSummary[];
  hasNext: boolean;
}

interface IGetTempPlanListParams {
  tripId: ITrip['tripId'];
  scheduleId: ISchedule['scheduleId'] | null;
  size: number;
}

export type TTempPlanDayId = null;

export type TScheduleSummary = Pick<
  ISchedule,
  'scheduleId' | 'title' | 'placeId' | 'placeName' | 'coordinate'
>;

export const getDailyPlanList = async (tripId: ITrip['tripId']) => {
  const res = await axios<IGetDailyPlanResponse>({
    method: 'get',
    url: `/trips/${tripId}/days`,
    requireAuth: true,
  });
  return res.data;
};

export const getTempPlanList = async ({
  tripId,
  scheduleId,
  size,
}: IGetTempPlanListParams) => {
  const res = await axios<ITempPlan>({
    method: 'get',
    url: `/trips/${tripId}/temporary-storage`,
    requireAuth: true,
    params: scheduleId
      ? {
          scheduleId,
          size,
        }
      : {
          size,
        },
  });
  return res.data;
};
