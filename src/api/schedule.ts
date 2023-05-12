import axios from '@/api/core';

interface ChangeScheduleOrderParams {
  scheduleId: string;
  destinationDailyPlanId: string;
  destinationScheduleIdx: number;
}

export interface Schedule {
  tripId: number;
  dayId: number | null;
  title: string;
  content: string;
  placeName: string;
  lat: number;
  lng: number;
}

export const createSchedule = async (schedule: Schedule) => {
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
}: ChangeScheduleOrderParams) => {
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

export const deleteSchedule = async (scheduleId: number) => {
  const res = await axios({
    method: 'delete',
    url: `/schedules/${scheduleId}`,
    requireAuth: true,
  });
  return res.status;
};
