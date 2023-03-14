import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import UserStatus, { UserStatusTypes } from '@/state/userStatus';

interface RouteProps {
  page: ReactElement | null;
}
const MustLogin = ({ page }: RouteProps) => {
  const userStatus = useRecoilValue(UserStatus);
  return userStatus === UserStatusTypes.LOGIN ? page : <Navigate to="/login" />;
};

const ExceptNone = ({ page }: RouteProps) => {
  const userStatus = useRecoilValue(UserStatus);
  return userStatus === UserStatusTypes.VISITOR ||
    userStatus === UserStatusTypes.LOGIN ? (
    page
  ) : (
    <Navigate to="/login" />
  );
};

const MustNone = ({ page }: RouteProps) => {
  const userStatus = useRecoilValue(UserStatus);
  return userStatus === UserStatusTypes.NONE ? page : <Navigate to="/" />;
};

export { MustLogin, ExceptNone, MustNone };
