import { useQuery } from '@tanstack/react-query';

import HTTP from '@/api';
import { IUserProfile } from '@/api/user';

const useGetUserInfo = (userId: IUserProfile['id']) => {
  return useQuery(['userInfo'], () => HTTP.getUserInfo(userId), {
    staleTime: 30 * 60 * 1000,
    suspense: true,
  });
};

export default useGetUserInfo;
