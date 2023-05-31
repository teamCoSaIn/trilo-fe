/* eslint-disable import/no-cycle */
import axios from '@/api/core';
import { ISchedule } from '@/api/schedule';
import { ITrip } from '@/api/trip';

export interface IDailyPlan {
  tripId: ITrip['tripId'];
  dayId: number;
  date: string;
  color: string;
  schedules: TScheduleSummary[];
}

export type TTempPlanDayId = null;

// 스케줄 서머리
export type TScheduleSummary = Pick<
  ISchedule,
  'scheduleId' | 'title' | 'placeId' | 'placeName' | 'coordinate'
>;

export const getDailyPlanList = async (tripId: ITrip['tripId']) => {
  const res = await axios<IDailyPlan[]>({
    method: 'get',
    url: `/trips/${tripId}/days`,
    requireAuth: true,
  });
  return res.data;
};

export const getTempPlanList = async (tripId: ITrip['tripId']) => {
  const res = await axios<TScheduleSummary[]>({
    method: 'get',
    url: `/trips/${tripId}/temporary-storage`,
    requireAuth: true,
  });
  return res.data;
};
