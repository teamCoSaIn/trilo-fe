import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import Error from '@/components/common/Error';
import CircularLoader from '@/components/common/Loader/index';
import Spacing from '@/components/common/Spacing';
import UserInfo from '@/components/UserInfo/index';

const User = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <UserInfoBox>
      <ErrorBoundary FallbackComponent={Error} onReset={reset}>
        <Suspense fallback={<CircularLoader />}>
          <Spacing height={99} />
          <UserInfo />
          <Spacing height={82} />
        </Suspense>
      </ErrorBoundary>
    </UserInfoBox>
  );
};

const UserInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  // TODO: 적절한 min width 정하기
  min-width: 500px;
`;

export default User;
