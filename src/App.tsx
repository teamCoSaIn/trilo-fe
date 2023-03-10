import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import HTTP from '@/api';
import Router from '@/Router';
import UserStatus, { UserStatusTypes } from '@/state/userStatus';

import worker from './mocks/browser';

if (process.env.NODE_ENV === 'development') {
  worker.start();
}

const App = () => {
  const setUserStatus = useSetRecoilState(UserStatus);
  // 갱신 요청하여 로그인 여부 판별
  useEffect(() => {
    HTTP.refreshAccessToken().then(() => {
      setUserStatus(UserStatusTypes.LOGIN);
    });
  }, [setUserStatus]);

  return <Router />;
};

export default App;
