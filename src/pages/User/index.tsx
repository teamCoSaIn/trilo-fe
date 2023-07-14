import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled, { css } from 'styled-components';

import CircularLoader from '@/components/common/CircularLoader/index';
import Error from '@/components/common/Error';
import Flex from '@/components/common/Flex';
import UserInfo from '@/components/UserInfo/index';
import useMedia from '@/hooks/useMedia';

const User = () => {
  const { isMobile } = useMedia();

  const { reset } = useQueryErrorResetBoundary();

  return (
    <Layout column alignCenter isMobile={isMobile}>
      <ErrorBoundary FallbackComponent={Error} onReset={reset}>
        <Suspense fallback={<CircularLoader />}>
          <UserInfo />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

const Layout = styled(Flex)<{ isMobile: boolean }>`
  min-height: 100%;
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        padding: 50px 0;
      `;
    }
    return css`
      padding: 100px 0;
    `;
  }}
`;

export default User;
