import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import HTTP from '@/api';
import RedirectUrl from '@/state/redirectUrl';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const oauthCode = searchParams.get('code') || '';
  const redirectUrl = useRecoilValue(RedirectUrl);
  const navigate = useNavigate();

  const onSuccess = () => {
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
