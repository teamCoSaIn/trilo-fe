import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import CircularLoader from '@/components/common/CircularLoader/index';
import Error from '@/components/common/Error';
import Flex from '@/components/common/Flex';
import UserInfo from '@/components/UserInfo/index';

const User = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Layout column alignCenter>
      <ErrorBoundary FallbackComponent={Error} onReset={reset}>
        <Suspense fallback={<CircularLoader />}>
          <UserInfo />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

const Layout = styled(Flex)`
  min-height: 100%;
  padding: 100px 0;
`;

export default User;
