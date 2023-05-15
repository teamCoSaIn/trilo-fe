import axios from '@/api/core';

export type PlanCardStatus = 'BEFORE' | 'AFTER' | 'ON' | '';
export interface PlanCardData {
  id: number;
  title: string;
  picUrl: string;
  status: PlanCardStatus;
  startDay: string;
  endDay: string;
}
export interface PlanCardTitleType {
  id: number;
  title: string;
}

export const getPlanCardDataList = async () => {
  const res = await axios<PlanCardData[]>({
    method: 'get',
    url: `/plancard-list`,
    requireAuth: true,
  });
  return res.data;
};

export const changePlanCardTitle = async (titleData: PlanCardTitleType) => {
  const res = await axios({
    method: 'put',
    url: `/plancard-title`,
    data: titleData,
    requireAuth: true,
  });
  return res.status;
};

export const createPlanCard = async (planCardTitle: string) => {
  const res = await axios({
    method: 'post',
    url: `/plancard`,
    data: { title: planCardTitle },
    requireAuth: true,
  });
  return res.status;
};

export const deletePlanCard = async (id: number) => {
  const res = await axios({
    method: 'delete',
    url: `/plancard/${id}`,
    requireAuth: true,
  });
  return res.status;
};
