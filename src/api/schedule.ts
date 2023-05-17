/* eslint-disable import/no-cycle */
import axios from '@/api/core';
import { IDailyPlan, TTempPlanDayId } from '@/api/plan';
import { ITrip } from '@/api/trip';

// 스케줄 생성할 때의 타입
export interface ICreateScheduleParams extends Omit<ISchedule, 'scheduleId'> {
  tripId: ITrip['tripId'];
}

// 진짜 스케줄: get으로 불러올 때의 타입
export interface ISchedule {
  dayId: IDailyPlan['dayId'] | TTempPlanDayId;
  scheduleId: number;
  title: string;
  content: string;
  placeName: string;
  coordinate: ICoordinate;
}

export interface ICoordinate {
  latitude: number;
  longitude: number;
}

interface IChangeScheduleOrderParams {
  scheduleId: ISchedule['scheduleId'];
  destinationDailyPlanId: IDailyPlan['dayId'] | TTempPlanDayId;
  destinationScheduleIdx: number;
}

export const createSchedule = async (schedule: ICreateScheduleParams) => {
  const res = await axios({
    method: 'post',
    url: '/schedules',
    data: schedule,
    requireAuth: true,
  });
  return res.data;
};

export const changeScheduleOrder = async ({
  scheduleId,
  destinationDailyPlanId,
  destinationScheduleIdx,
}: IChangeScheduleOrderParams) => {
  const res = await axios({
    method: 'patch',
    url: `/schedules/${scheduleId}`,
    data: {
      targetDay: destinationDailyPlanId,
      targetOrder: destinationScheduleIdx,
    },
    requireAuth: true,
  });
  return res.data;
};

export const deleteSchedule = async (scheduleId: ISchedule['scheduleId']) => {
  const res = await axios({
    method: 'delete',
    url: `/schedules/${scheduleId}`,
    requireAuth: true,
  });
  return res.status;
};
