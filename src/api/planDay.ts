import axios from '@/api/core';

interface PlanDay {
  tripId: number;
  dayId: number;
  date: number;
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

export const getPlanDayList = async (planId: string) => {
  const res = await axios<PlanDay[]>({
    method: 'get',
    url: `/trips/${planId}/days`,
    requireAuth: true,
  });
  return res.data;
};
