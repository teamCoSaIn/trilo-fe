import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import HTTP from '@/api';
import { IGetAccessTokenResponse } from '@/api/oauth';
import CircularLoader from '@/components/common/CircularLoader/index';
import REDIRECT_URL from '@/constants/route';
import UserStatus, { UserId, UserStatusTypes } from '@/states/userStatus';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const oauthCode = searchParams.get('code') || '';
  const oauthState = searchParams.get('state') || '';

  const navigate = useNavigate();
  const setUserStatus = useSetRecoilState(UserStatus);
  const setUserId = useSetRecoilState(UserId);

  const onSuccess = (data: IGetAccessTokenResponse) => {
    setUserStatus(UserStatusTypes.LOGIN);
    setUserId(data.tripperId);
    const redirectUrl = localStorage.getItem(REDIRECT_URL) || '/';
    navigate(redirectUrl);
  };

  const onError = () => {
    alert('잘못된 접근입니다.');
    navigate('/login');
  };

  const getOauthData = (
    oauthServerName: string,
    code: string,
    state: string,
    redirectUri: string
  ) => {
    switch (oauthServerName) {
      case 'kakao':
        return { code, redirect_uri: redirectUri };
      case 'google':
        return { code, redirect_uri: redirectUri };
      case 'naver':
        return { code, state };
      default:
        return { code, state, redirect_uri: redirectUri };
    }
  };

  useEffect(() => {
    const localOauthState = localStorage.getItem('oauthState');
    const localOauthServerName = localStorage.getItem('oauthServerName');

    if (
      oauthCode &&
      oauthState &&
      localOauthServerName &&
      oauthState === localOauthState
    ) {
      const oauthData = getOauthData(
        localOauthServerName,
        oauthCode,
        oauthState,
        process.env.OAUTH_REDIRECT_URI as string
      );
      HTTP.getAccessToken({ oauthServerName: localOauthServerName, oauthData })
        .then(data => onSuccess(data))
        .catch(() => onError());
    } else {
      onError();
    }
  }, []);

  return <CircularLoader />;
};

export default Callback;
