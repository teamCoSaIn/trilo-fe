import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import CircularLoader from '@/components/common/Loader/index';
import ErrorFallback from '@/components/OAuthBtnContainer/errorFallback';
import UserInfo from '@/components/UserInfo/index';

const User = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <UserInfoBox>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
        <Suspense fallback={<CircularLoader />}>
          <UserInfo />
        </Suspense>
      </ErrorBoundary>
    </UserInfoBox>
  );
};

const UserInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 124px;
  height: 100%;
  width: 500px;
  margin: 0 auto;
`;

export default User;
