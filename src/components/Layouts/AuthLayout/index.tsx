import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import HTTP from '@/api';
import UserStatus, { UserStatusTypes } from '@/state/userStatus';

const AuthLayout = () => {
  const setUserStatus = useSetRecoilState(UserStatus);
  useQuery(['checkRefresh'], () => HTTP.checkRefreshToken(), {
    onSuccess: response => {
      if (response.response) return setUserStatus(UserStatusTypes.LOGIN);
      return setUserStatus(UserStatusTypes.NONE);
    },
    staleTime: 30 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    suspense: true,
  });
  return <Outlet />;
};

export default AuthLayout;
