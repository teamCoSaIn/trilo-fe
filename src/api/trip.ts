import axios from '@/api/core';

export type TripCardStatus = 'BEFORE' | 'AFTER' | 'ON' | '';

export interface ITrip {
  tripId: number;
  title: string;
  picUrl: string;
  status: TripCardStatus;
  startDay: string;
  endDay: string;
}

// TODO: 명세 확정 후 이름 바꾸기
export interface TripCardTitleType {
  id: number;
  title: string;
}

export const getTripList = async () => {
  const res = await axios<ITrip[]>({
    method: 'get',
    url: `/tripcard-list`,
    requireAuth: true,
  });
  return res.data;
};

export const changeTripTitle = async (titleData: TripCardTitleType) => {
  const res = await axios({
    method: 'put',
    url: `/tripcard-title`,
    data: titleData,
    requireAuth: true,
  });
  return res.status;
};

export const createTrip = async (tripTitle: string) => {
  const res = await axios({
    method: 'post',
    url: `/tripcard`,
    data: { title: tripTitle },
    requireAuth: true,
  });
  return res.status;
};

export const deleteTrip = async (id: number) => {
  const res = await axios({
    method: 'delete',
    url: `/tripcard/${id}`,
    requireAuth: true,
  });
  return res.status;
};
