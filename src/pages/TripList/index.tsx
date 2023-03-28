import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import Error from '@/components/common/Error';
import CircularLoader from '@/components/common/Loader';
import TripListContainer from '@/components/TripListContainer';

const TripList = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Layout>
      <ErrorBoundary FallbackComponent={Error} onReset={reset}>
        <Suspense fallback={<CircularLoader />}>
          <TripListContainer />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  padding-top: 104px;
  margin: 0 auto;
`;

export default TripList;
