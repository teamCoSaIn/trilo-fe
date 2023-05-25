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

interface IGetTripListParams {
  tripperId: number;
  size?: number;
  page?: number;
  sort?: string;
}

export interface IGetTripListResponse {
  trips: ITrip[];
  totalCount: number;
  totalPage: number;
  currentPage: number;
  isLast: boolean;
}

export const getTripList = async (reqParams: IGetTripListParams) => {
  const res = await axios<IGetTripListResponse>({
    method: 'get',
    url: `/tripcard-list`,
    requireAuth: true,
    params: reqParams,
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

export const changeTripImg = async (tripImgData: FormData) => {
  const res = await axios({
    method: 'put',
    url: `/tripcard-img`,
    data: tripImgData,
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
