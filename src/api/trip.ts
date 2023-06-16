import axios from '@/api/core';

export type TTripCardStatus = 'BEFORE' | 'AFTER' | 'ON' | '';

export interface ITrip {
  tripperId: number;
  tripId: number;
  title: string;
  picUrl: string;
  status: TTripCardStatus;
  startDate: string;
  endDate: string;
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

export type TCreateTripTitleParams = ITrip['title'];

export type TDeleteTripTitleParams = ITrip['tripId'];

export type TGetTripParams = ITrip['tripId'];

interface IGetTripListParams {
  ['tripper-id']: ITrip['tripperId'];
  size?: number;
  page?: number;
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
    method: 'patch',
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
    method: 'patch',
    url: `/trips/${tripPeriodData.tripId}/period`,
    data: tripPeriodData,
    requireAuth: true,
  });
  return res.status;
};

export const changeTripImg = async (tripImgData: IChangeTripImageParams) => {
  const res = await axios({
    method: 'patch',
    url: `/trips/${tripImgData.tripId}/image`,
    data: tripImgData.formData,
    requireAuth: true,
  });
  return res.status;
};

export const createTrip = async (tripTitle: TCreateTripTitleParams) => {
  const res = await axios({
    method: 'post',
    url: `/trips`,
    data: { title: tripTitle },
    requireAuth: true,
  });
  return res.status;
};

export const deleteTrip = async (tripId: TDeleteTripTitleParams) => {
  const res = await axios({
    method: 'delete',
    url: `/trips/${tripId}`,
    requireAuth: true,
  });
  return res.status;
};
