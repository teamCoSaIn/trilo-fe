import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled, { css } from 'styled-components';

import Error from '@/components/common/Error';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import TripCardList from '@/components/TripCardList';
import TripCardListSkeleton from '@/components/TripCardList/TripCardListSkeleton';
import TripsInfo from '@/components/TripsInfo';
import TripsInfoSkeleton from '@/components/TripsInfo/TripsInfoSkeleton';
import useMedia from '@/hooks/useMedia';

const TripList = () => {
  const { isMobile } = useMedia();

  const { reset } = useQueryErrorResetBoundary();

  return (
    <Layout column isMobile={isMobile}>
      <ErrorBoundary FallbackComponent={Error} onReset={reset}>
        <Suspense fallback={<TripsInfoSkeleton />}>
          <TripsInfo />
        </Suspense>
        <Spacing height={47} />
        <Suspense fallback={<TripCardListSkeleton />}>
          <TripCardList />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

const Layout = styled(Flex)<{ isMobile: boolean }>`
  min-height: 100%;
  width: 100%;
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        padding: 50px 20px;
      `;
    }
    return css`
      padding: 100px;
    `;
  }}
`;

export default TripList;
