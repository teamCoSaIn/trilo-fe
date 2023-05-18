import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import Error from '@/components/common/Error';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import TripCardList from '@/components/TripCardList';
import TripCardListSkeleton from '@/components/TripCardList/TripCardListSkeleton';
import TripsInfo from '@/components/TripsInfo';
import TripsInfoSkeleton from '@/components/TripsInfo/TripsInfoSkeleton';

const TripList = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Layout column>
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

const Layout = styled(Flex)`
  min-height: 100%;
  padding: 100px;
`;

export default TripList;
