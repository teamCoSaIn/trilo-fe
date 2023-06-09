import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import HTTP from '@/api';
import CircularLoader from '@/components/common/Loader/index';
import REDIRECT_URL from '@/constants/route';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const oauthCode = searchParams.get('code') || '';
  const oauthState = searchParams.get('state') || '';

  const navigate = useNavigate();
  const setUserStatus = useSetRecoilState(UserStatus);

  const onSuccess = () => {
    setUserStatus(UserStatusTypes.LOGIN);
    const redirectUrl = localStorage.getItem(REDIRECT_URL) || '/';
    navigate(redirectUrl);
  };

  const onError = () => {
    alert('잘못된 접근입니다.');
    navigate('/login');
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
      HTTP.getAccessToken(
        localOauthServerName,
        oauthCode,
        process.env.OAUTH_REDIRECT_URI as string
      )
        .then(() => onSuccess())
        .catch(() => onError());
    } else {
      onError();
    }
  }, []);

  return <CircularLoader />;
};

export default Callback;
