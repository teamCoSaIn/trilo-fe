import axios from '@/api/core';

export type TripCardStatus = 'BEFORE' | 'AFTER' | 'ON' | '';
export interface TripCardData {
  id: number;
  title: string;
  picUrl: string;
  status: TripCardStatus;
  startDay: string;
  endDay: string;
}
export interface TripCardTitleType {
  id: number;
  title: string;
}

export const getTripList = async () => {
  const res = await axios<TripCardData[]>({
    method: 'get',
    url: `/trip-list`,
    requireAuth: true,
  });
  return res.data;
};

export const changeTripCardTitle = async (titleData: TripCardTitleType) => {
  const res = await axios({
    method: 'put',
    url: `/tripcard-title`,
    data: titleData,
    requireAuth: true,
  });
  return res.status;
};

export const createTripCard = async (tripCardTitle: string) => {
  const res = await axios({
    method: 'post',
    url: `/tripcard`,
    data: { title: tripCardTitle },
    requireAuth: true,
  });
  return res.status;
};
