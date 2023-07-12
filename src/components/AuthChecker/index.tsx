import { useQuery } from '@tanstack/react-query';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { ReactNode } from 'react';
import { useSetRecoilState } from 'recoil';

import HTTP from '@/api';
import UserStatus, { UserId, UserStatusTypes } from '@/states/userStatus';

interface IAuthCheckerProps {
  children: ReactNode;
}

const AuthChecker = ({ children }: IAuthCheckerProps) => {
  const setUserStatus = useSetRecoilState(UserStatus);
  const setUserId = useSetRecoilState(UserId);

  const { data } = useQuery(
    ['checkRefreshToken'],
    () => HTTP.checkRefreshToken(),
    {
      onSuccess: response => {
        if (response.availability) {
          return setUserStatus(UserStatusTypes.LOGIN);
        }
        return setUserStatus(UserStatusTypes.LOGOUT);
      },
      staleTime: 30 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchInterval: 30 * 60 * 1000,
      suspense: true,
      useErrorBoundary: false,
    }
  );

  // 최초 한번만 동작하는 자동로그인
  useQuery(['setLogin'], () => HTTP.refreshAccessToken(), {
    onSuccess: response => {
      const decoded: JwtPayload = jwt_decode(response.accessToken);
      setUserId(+(decoded.sub as string));
    },
    onError: () => {
      setUserStatus(UserStatusTypes.LOGOUT);
    },
    enabled: !!data?.availability,
    staleTime: Infinity,
    cacheTime: Infinity,
    suspense: true,
    useErrorBoundary: false,
  });

  return <>{children}</>;
};

export default AuthChecker;
