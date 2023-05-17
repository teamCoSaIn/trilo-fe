import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import Error from '@/components/common/Error';
import Spacing from '@/components/common/Spacing';
import TripCardList from '@/components/TripCardList';
import TripCardListSkeleton from '@/components/TripCardList/TripCardListSkeleton';
import TripsInfo from '@/components/TripsInfo';
import TripsInfoSkeleton from '@/components/TripsInfo/TripsInfoSkeleton';

const TripList = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Layout>
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

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 104px 150px 0 150px;
  // TODO: padding * 2 + TripTripCardWidth * 4 + TripTripCardBoxGap * 3
  min-width: 1364px;
`;

export default TripList;
