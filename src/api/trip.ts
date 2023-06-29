import axios from '@/api/core';

export type TTripCardStatus = 'BEFORE' | 'AFTER' | 'ON' | '';

export interface ITrip {
  tripId: number;
  tripperId: number;
  title: string;
  status: TTripCardStatus;
  startDate: string;
  endDate: string;
  imageURL: string;
}

export type TChangeTripTitleParams = Pick<ITrip, 'tripId' | 'title'>;

export type TChangeTripPeriodParams = Pick<
  ITrip,
  'tripId' | 'startDate' | 'endDate'
>;

export interface IChangeTripImageParams {
  tripId: ITrip['tripId'];
  formData: FormData;
}

type TCreateTripParams = ITrip['title'];

export type TDeleteTripParams = ITrip['tripId'];

type TGetTripParams = ITrip['tripId'];

interface IGetTripListParams {
  tripperId: ITrip['tripperId'];
  tripId: ITrip['tripId'] | null;
  size: number;
}

export interface IGetTripListResponse {
  trips: ITrip[];
  hasNext: boolean;
}

export const getTrip = async (tripId: TGetTripParams) => {
  const res = await axios<ITrip>({
    method: 'get',
    url: `/trips/${tripId}`,
    requireAuth: true,
  });
  return res.data;
};

export const getTripList = async (reqParams: IGetTripListParams) => {
  const res = await axios<IGetTripListResponse>({
    method: 'get',
    url: `/trips`,
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
    url: `/trips/${tripTitleData.tripId}/title`,
    data: tripTitleData,
    requireAuth: true,
  });
  return res.status;
};

export const changeTripPeriod = async (
  tripPeriodData: TChangeTripPeriodParams
) => {
  const res = await axios({
    method: 'put',
    url: `/trips/${tripPeriodData.tripId}/period`,
    data: tripPeriodData,
    requireAuth: true,
  });
  return res.status;
};

export const changeTripImg = async (tripImgData: IChangeTripImageParams) => {
  const res = await axios({
    method: 'post',
    url: `/trips/${tripImgData.tripId}/image/update`,
    data: tripImgData.formData,
    requireAuth: true,
  });
  return res.status;
};

export const createTrip = async (tripTitle: TCreateTripParams) => {
  const res = await axios({
    method: 'post',
    url: `/trips`,
    data: { title: tripTitle },
    requireAuth: true,
  });
  return res.status;
};

export const deleteTrip = async (tripId: TDeleteTripParams) => {
  const res = await axios({
    method: 'delete',
    url: `/trips/${tripId}`,
    requireAuth: true,
  });
  return res.status;
};
