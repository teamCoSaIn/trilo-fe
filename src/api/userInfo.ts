import axios from '@/api/core';

export interface UserProfile {
  nickname: string;
  imgUrl: string;
}

interface UserInfo {
  totalDistanceOfPastTrip: number;
  totalNumOfTrip: number;
  badgeImgUrl: string;
}

export const getUserProfile = async () => {
  const res = await axios<UserProfile>({
    method: 'get',
    url: `/user-profile`,
    requireAuth: true,
  });
  return res.data;
};

export const changeNickname = async (nickname: string) => {
  const res = await axios({
    method: 'put',
    url: `/user-nickname`,
    data: { nickname },
    requireAuth: true,
  });
  return res.status;
};

export const getUserInfo = async () => {
  const res = await axios<UserInfo>({
    method: 'get',
    url: '/user-info',
    requireAuth: true,
  });
  return res.data;
};
