import axios from '@/api/core';

export type TTripCardStatus = 'BEFORE' | 'AFTER' | 'ON' | '';

export interface ITrip {
  tripId: number;
  title: string;
  picUrl: string;
  status: TTripCardStatus;
  startDay: string;
  endDay: string;
}

export type TChangeTripTitleParams = Pick<ITrip, 'tripId' | 'title'>;

export type TCreateTripTitleParams = ITrip['title'];

export type TDeleteTripTitleParams = ITrip['tripId'];

export const getTripList = async () => {
  const res = await axios<ITrip[]>({
    method: 'get',
    url: `/tripcard-list`,
    requireAuth: true,
  });
  return res.data;
};

export const changeTripTitle = async (
  tripTitleData: TChangeTripTitleParams
) => {
  const res = await axios({
    method: 'put',
    url: `/tripcard-title`,
    data: tripTitleData,
    requireAuth: true,
  });
  return res.status;
};

export const createTrip = async (tripTitle: TCreateTripTitleParams) => {
  const res = await axios({
    method: 'post',
    url: `/tripcard`,
    data: { title: tripTitle },
    requireAuth: true,
  });
  return res.status;
};

export const deleteTrip = async (tripId: TDeleteTripTitleParams) => {
  const res = await axios({
    method: 'delete',
    url: `/tripcard/${tripId}`,
    requireAuth: true,
  });
  return res.status;
};
