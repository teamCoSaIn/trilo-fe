import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useSetRecoilState } from 'recoil';

import HTTP from '@/api';
import { UserProfileImgUrl, UserProfileNickname } from '@/states/userProfile';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setUserStatus = useSetRecoilState(UserStatus);

  const setUserProfileNickname = useSetRecoilState(UserProfileNickname);
  const setUserProfileImgUrl = useSetRecoilState(UserProfileImgUrl);

  useQuery(['checkRefresh'], () => HTTP.checkRefreshToken(), {
    onSuccess: async response => {
      if (response.response) {
        const { nickname, imgUrl } = await HTTP.getUserProfile();
        if (nickname) {
          setUserProfileNickname(nickname);
        }
        if (imgUrl) {
          setUserProfileImgUrl(imgUrl);
        }
        return setUserStatus(UserStatusTypes.LOGIN);
      }
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
