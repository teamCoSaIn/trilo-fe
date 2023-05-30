import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import HTTP from '@/api';
import CircularLoader from '@/components/common/CircularLoader/index';
import REDIRECT_URL from '@/constants/route';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const oauthCode = searchParams.get('code') || '';
  const oauthState = searchParams.get('state') || '';

  const navigate = useNavigate();
  const setUserStatus = useSetRecoilState(UserStatus);

  const onSuccess = async () => {
    setUserStatus(UserStatusTypes.LOGIN);
    const redirectUrl = localStorage.getItem(REDIRECT_URL) || '/';
    navigate(redirectUrl);
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

  return <CircularLoader />;
};

export default Callback;
