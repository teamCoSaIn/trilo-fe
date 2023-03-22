import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import HTTP from '@/api';
import REDIRECT_URL from '@/constants/route';
import { UserProfileImgUrl, UserProfileNickname } from '@/states/userProfile';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const oauthCode = searchParams.get('code') || '';
  const oauthState = searchParams.get('state') || '';

  const navigate = useNavigate();
  const setUserStatus = useSetRecoilState(UserStatus);
  const setUserProfileNickname = useSetRecoilState(UserProfileNickname);
  const setUserProfileImgUrl = useSetRecoilState(UserProfileImgUrl);

  const onSuccess = async () => {
    setUserStatus(UserStatusTypes.LOGIN);
    const redirectUrl = localStorage.getItem(REDIRECT_URL) || '/';
    navigate(redirectUrl);
    const { nickname, imgUrl } = await HTTP.getUserProfile();
    if (nickname) {
      setUserProfileNickname(nickname);
    }
    if (imgUrl) {
      setUserProfileImgUrl(imgUrl);
    }
  };

  const onError = () => {
    navigate('/login');
  };

  useQuery(
    ['getAccessToken', oauthCode],
    () => HTTP.getAccessToken(oauthCode, oauthState),
    {
      enabled: !!oauthCode,
      onSuccess,
      onError,
    }
  );

  return <div>Login...</div>;
};

export default Callback;
