import axios from '@/api/core';

export interface PlanDay {
  tripId: number;
  dayId: number;
  date: string | null;
  color: string;
  schedules: Schedule[];
}

interface Schedule {
  scheduleId: number;
  title: string;
  placeName: string;
  coordinate: Coordinate;
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

export const getPlanDayList = async (tripId: string) => {
  const res = await axios<PlanDay[]>({
    method: 'get',
    url: `/trips/${tripId}/days`,
    requireAuth: true,
  });
  return res.data;
};
