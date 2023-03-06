import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import HTTP from '@/api';
import AccessToken from '@/state/accessToken';
import RedirectUrl from '@/state/redirectUrl';

interface AccessTokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  scope: string;
  refresh_token: string;
}

const Callback = () => {
  const [searchParams] = useSearchParams();
  const oauthCode = searchParams.get('code') || '';
  const setAccessToken = useSetRecoilState(AccessToken);
  const redirectUrl = useRecoilValue(RedirectUrl);
  const navigate = useNavigate();

  const onSuccess = (data: AccessTokenResponse) => {
    setAccessToken(data.access_token);
    navigate(redirectUrl);
  };

  const onError = () => {
    navigate('/login');
  };

  // 백엔드에 get요청 보내기
  const { data } = useQuery(
    ['getAccessToken', oauthCode],
    () => HTTP.getAccessToken<AccessTokenResponse>(oauthCode),
    {
      enabled: !!oauthCode,
      onSuccess,
      onError,
    }
  );

  return <div>Login...</div>;
};

export default Callback;
