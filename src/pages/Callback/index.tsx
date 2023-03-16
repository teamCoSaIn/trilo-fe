import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import HTTP from '@/api';
import REDIRECT_URL from '@/constants/route';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const oauthCode = searchParams.get('code') || '';

  const navigate = useNavigate();
  const setUserStatus = useSetRecoilState(UserStatus);

  const onSuccess = () => {
    setUserStatus(UserStatusTypes.LOGIN);
    const redirectUrl = localStorage.getItem(REDIRECT_URL) || '/';
    navigate(redirectUrl);
  };

  const onError = () => {
    navigate('/login');
  };

  useQuery(
    ['getAccessToken', oauthCode],
    () => HTTP.getAccessToken(oauthCode),
    {
      enabled: !!oauthCode,
      onSuccess,
      onError,
    }
  );

  return <div>Login...</div>;
};

export default Callback;
