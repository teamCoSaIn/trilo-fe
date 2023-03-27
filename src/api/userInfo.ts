import axios from '@/api/core';

interface UserProfile {
  nickname: string;
  imgUrl: string;
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
  const res = await axios<UserProfile>({
    method: 'put',
    url: `/user-nickname`,
    data: { nickname },
    requireAuth: true,
  });
  return res.status;
};
