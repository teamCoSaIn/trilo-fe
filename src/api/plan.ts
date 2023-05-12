import axios from '@/api/core';

export interface IDailyPlan {
  tripId: number;
  dayId: number;
  date: string | null;
  color: string;
  schedules: IScheduleResponse[];
}

export interface IScheduleResponse {
  scheduleId: number;
  title: string;
  placeName: string;
  coordinate: Coordinate;
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

export const getDailyPlanList = async (tripId: string) => {
  const res = await axios<IDailyPlan[]>({
    method: 'get',
    url: `/trips/${tripId}/days`,
    requireAuth: true,
  });
  return res.data;
};
