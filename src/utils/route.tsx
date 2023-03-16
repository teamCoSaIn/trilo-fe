import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import REDIRECT_URL from '@/constants/route';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

interface RouteProps {
  page: ReactElement | null;
}

const EveryUser = ({ page }: RouteProps) => {
  const userStatus = useRecoilValue(UserStatus);

  if (userStatus === UserStatusTypes.LOGOUT) {
    localStorage.setItem(REDIRECT_URL, window.location.pathname);
  }

  return page;
};

const OnlyLoginUser = ({ page }: RouteProps) => {
  const userStatus = useRecoilValue(UserStatus);

  if (userStatus === UserStatusTypes.LOGOUT) {
    localStorage.setItem(REDIRECT_URL, window.location.pathname);
  }

  return userStatus === UserStatusTypes.LOGIN ? (
    page
  ) : (
    <Navigate to="/login" replace />
  );
};

const ExceptLogoutUser = ({ page }: RouteProps) => {
  const userStatus = useRecoilValue(UserStatus);

  if (userStatus === UserStatusTypes.LOGOUT) {
    localStorage.setItem(REDIRECT_URL, window.location.pathname);
  }

  return userStatus === UserStatusTypes.LOGOUT ? (
    <Navigate to="/login" replace />
  ) : (
    page
  );
};

const ExceptLoginUser = ({ page }: RouteProps) => {
  const userStatus = useRecoilValue(UserStatus);
  return userStatus === UserStatusTypes.LOGIN ? (
    <Navigate to="/" replace />
  ) : (
    page
  );
};

export { EveryUser, OnlyLoginUser, ExceptLogoutUser, ExceptLoginUser };
