import axios from '@/api/core';

export interface IUserProfile {
  id: number;
  name: string;
  email: string;
  profileImageURL: string;
  authProvider: string;
  role: string;
}

interface IUserInfo {
  totalDistanceOfPastTrip: number;
  totalNumOfTrip: number;
  badgeImgUrl: string;
}

export const getUserProfile = async (userId: IUserProfile['id']) => {
  const res = await axios<IUserProfile>({
    method: 'get',
    url: `/users/${userId}/profile`,
    requireAuth: true,
  });
  return res.data;
};

export const changeNickname = async (nickname: IUserProfile['name']) => {
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

export const resign = async (userId: IUserProfile['id']) => {
  const res = await axios({
    method: 'delete',
    url: `/users/${userId}`,
    requireAuth: true,
  });
  delete axios.defaults.headers.common.Authorization;
  return res.status;
};
