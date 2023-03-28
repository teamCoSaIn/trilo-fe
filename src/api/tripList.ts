import axios from '@/api/core';

export type TripCardStatus = 'BEFORE' | 'AFTER' | 'ON';
export interface TripCardData {
  id: number;
  title: string;
  picUrl: string;
  status: TripCardStatus;
  startDay: string;
  endDay: string;
}

export const getTripList = async () => {
  const res = await axios<TripCardData[]>({
    method: 'get',
    url: `/trip-list`,
    requireAuth: true,
  });
  return res.data;
};
