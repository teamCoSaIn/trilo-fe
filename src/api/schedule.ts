/* eslint-disable import/no-cycle */
import axios from '@/api/core';
import { IDailyPlan, TTempPlanDayId } from '@/api/plan';
import { ITrip } from '@/api/trip';

// 스케줄 생성할 때의 타입
export interface ICreateScheduleParams
  extends Omit<ISchedule, 'scheduleId' | 'content' | 'scheduleTime'> {
  tripId: ITrip['tripId'];
}

interface IScheduleTime {
  startTime: string;
  endTime: string;
}

// 진짜 스케줄: get으로 불러올 때의 타입
export interface ISchedule {
  scheduleId: number;
  dayId: IDailyPlan['dayId'] | TTempPlanDayId;
  title: string;
  placeName: string;
  content: string;
  placeId: string;
  coordinate: ICoordinate;
  scheduleTime: IScheduleTime;
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

export interface IChangeScheduleDetailsParams {
  scheduleId: ISchedule['scheduleId'];
  title: ISchedule['title'];
  content: ISchedule['content'];
  startTime: IScheduleTime['startTime'];
  endTime: IScheduleTime['endTime'];
}

export interface IChangeScheduleDetailsResponse {
  scheduleId: ISchedule['scheduleId'];
  beforeDayId: IDailyPlan['dayId'] | TTempPlanDayId;
  afterDayId: IDailyPlan['dayId'] | TTempPlanDayId;
  positionChanged: boolean;
}

export const createSchedule = async (schedule: ICreateScheduleParams) => {
  const res = await axios<ISchedule['scheduleId']>({
    method: 'post',
    url: '/schedules',
    data: schedule,
    requireAuth: true,
  });
  return res.data;
};

export const changeScheduleDetails = async ({
  scheduleId,
  title,
  content,
  startTime,
  endTime,
}: IChangeScheduleDetailsParams) => {
  const res = await axios<ISchedule['scheduleId']>({
    method: 'put',
    url: `/schedules/${scheduleId}`,
    data: {
      title,
      content,
      startTime,
      endTime,
    },
    requireAuth: true,
  });
  return res.data;
};

export const changeScheduleOrder = async ({
  scheduleId,
  destinationDailyPlanId,
  destinationScheduleIdx,
}: IChangeScheduleOrderParams) => {
  const res = await axios<IChangeScheduleDetailsResponse>({
    method: 'put',
    url: `/schedules/${scheduleId}/position`,
    data: {
      targetDayId: destinationDailyPlanId,
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

export const getScheduleDetails = async (
  scheduleId: ISchedule['scheduleId']
) => {
  const res = await axios<ISchedule>({
    method: 'get',
    url: `/schedules/${scheduleId}`,
    requireAuth: true,
  });
  return res.data;
};
