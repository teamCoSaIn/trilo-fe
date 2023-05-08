import axios from '@/api/core';

interface ChangeScheduleOrderParams {
  scheduleId: string;
  destinationDayId: string;
  destinationDayIdx: number;
}

export const changeScheduleOrder = async ({
  scheduleId,
  destinationDayId,
  destinationDayIdx,
}: ChangeScheduleOrderParams) => {
  const res = await axios({
    method: 'patch',
    url: `/schedules/${scheduleId}`,
    data: {
      targetDay: destinationDayId,
      targetOrder: destinationDayIdx,
    },
    requireAuth: true,
  });
  return res.data;
};
