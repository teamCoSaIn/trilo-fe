import axios from '@/api/core';

export interface IUserProfile {
  nickname: string;
  imgUrl: string;
}

interface IUserInfo {
  totalDistanceOfPastTrip: number;
  totalNumOfTrip: number;
  badgeImgUrl: string;
}

export const getUserProfile = async () => {
  const res = await axios<IUserProfile>({
    method: 'get',
    url: `/user-profile`,
    requireAuth: true,
  });
  return res.data;
};

export const changeNickname = async (nickname: IUserProfile['nickname']) => {
  const res = await axios({
    method: 'put',
    url: `/user-nickname`,
    data: { nickname },
    requireAuth: true,
  });
  return res.status;
};

export const getUserInfo = async () => {
  const res = await axios<IUserInfo>({
    method: 'get',
    url: '/user-info',
    requireAuth: true,
  });
  return res.data;
};
