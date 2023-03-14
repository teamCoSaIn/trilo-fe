import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useSetRecoilState } from 'recoil';

import HTTP from '@/api';
import UserStatus, { UserStatusTypes } from '@/state/userStatus';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setUserStatus = useSetRecoilState(UserStatus);

  useQuery(['checkRefresh'], () => HTTP.checkRefreshToken(), {
    onSuccess: response => {
      if (response.response) return setUserStatus(UserStatusTypes.LOGIN);
      return setUserStatus(UserStatusTypes.LOGOUT);
    },
    staleTime: 30 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    suspense: true,
  });

  return <>{children}</>;
};

export default AuthProvider;
