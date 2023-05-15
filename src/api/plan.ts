/* eslint-disable import/no-cycle */
import axios from '@/api/core';
import { ISchedule } from '@/api/schedule';
import { ITrip } from '@/api/trip';

export interface IDailyPlan {
  tripId: ITrip['tripId'];
  dayId: number;
  date: string | null;
  color: string;
  schedules: TScheduleSummary[];
}

export interface ITempPlan extends Omit<IDailyPlan, 'dayId'> {
  dayId: null;
}

// 스케줄 서머리
type TScheduleSummary = Pick<
  ISchedule,
  'scheduleId' | 'title' | 'placeName' | 'coordinate'
>;

export const getDailyPlanList = async (tripId: ITrip['tripId']) => {
  const res = await axios<IDailyPlan[]>({
    method: 'get',
    url: `/trips/${tripId}/days`,
    requireAuth: true,
  });
  return res.data;
};
