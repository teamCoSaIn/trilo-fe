import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import HTTP from '@/api';
import RedirectUrl from '@/state/redirectUrl';
import UserStatus, { UserStatusTypes } from '@/state/userStatus';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const oauthCode = searchParams.get('code') || '';
  const redirectUrl = useRecoilValue(RedirectUrl);
  const navigate = useNavigate();
  const setUserStatus = useSetRecoilState(UserStatus);

  const onSuccess = () => {
    setUserStatus(UserStatusTypes.LOGIN);
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
