import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import UserStatus, { UserStatusTypes } from '@/state/userStatus';

interface RouteProps {
  page: ReactElement | null;
}

const MustLogin = ({ page }: RouteProps) => {
  const userStatus = useRecoilValue(UserStatus);
  return userStatus === UserStatusTypes.LOGIN ? (
    page
  ) : (
    <Navigate to="/login" replace />
  );
};

const ExceptLogout = ({ page }: RouteProps) => {
  const userStatus = useRecoilValue(UserStatus);
  return userStatus === UserStatusTypes.LOGOUT ? (
    <Navigate to="/login" replace />
  ) : (
    page
  );
};

const ExceptLogin = ({ page }: RouteProps) => {
  const userStatus = useRecoilValue(UserStatus);
  return userStatus === UserStatusTypes.LOGIN ? (
    <Navigate to="/" replace />
  ) : (
    page
  );
};

export { MustLogin, ExceptLogout, ExceptLogin };
