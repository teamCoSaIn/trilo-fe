import axios from '@/api/core';

export interface IUserProfile {
  id: number;
  nickName: string;
  email: string;
  profileImageURL: string;
  authProvider: string;
  role: string;
}

interface IUserInfo {
  nickName: string;
  imageURL: string;
  tripStatistics: ITripStatistics;
}

interface ITripStatistics {
  totalTripCnt: number;
  terminatedTripCnt: number;
}

interface IChangeNicknameParams {
  userId: IUserProfile['id'];
  nickName: IUserProfile['nickName'];
}

export const getUserProfile = async (userId: IUserProfile['id']) => {
  const res = await axios<IUserProfile>({
    method: 'get',
    url: `/users/${userId}/profile`,
    requireAuth: true,
  });
  return res.data;
};

export const changeNickname = async ({
  userId,
  nickName,
}: IChangeNicknameParams) => {
  const res = await axios({
    method: 'patch',
    url: `/users/${userId}`,
    data: { nickName },
    requireAuth: true,
  });
  return res.status;
};

export const getUserInfo = async (userId: IUserProfile['id']) => {
  const res = await axios<IUserInfo>({
    method: 'get',
    url: `/users/${userId}/my-page`,
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
