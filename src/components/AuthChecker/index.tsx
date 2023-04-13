import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useSetRecoilState } from 'recoil';

import HTTP from '@/api';
import { UserProfileImgUrl, UserProfileNickname } from '@/states/userProfile';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthChecker = ({ children }: AuthProviderProps) => {
  const setUserStatus = useSetRecoilState(UserStatus);
  const setUserProfileNickname = useSetRecoilState(UserProfileNickname);
  const setUserProfileImgUrl = useSetRecoilState(UserProfileImgUrl);

  const { data } = useQuery(
    ['checkRefreshToken'],
    () => HTTP.checkRefreshToken(),
    {
      onSuccess: async response => {
        if (response.response) {
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

  useQuery(['setLogin'], () => HTTP.refreshAccessToken(), {
    onSuccess: async () => {
      const { nickname, imgUrl } = await HTTP.getUserProfile();
      if (nickname) {
        setUserProfileNickname(nickname);
      }
      if (imgUrl) {
        setUserProfileImgUrl(imgUrl);
      }
    },
    enabled: !!data?.response,
    staleTime: Infinity,
    suspense: true,
    useErrorBoundary: false,
  });

  return <>{children}</>;
};

export default AuthChecker;
