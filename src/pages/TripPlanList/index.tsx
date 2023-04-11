import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import Error from '@/components/common/Error';
import PlanCardList from '@/components/PlanCardList';
import PlanCardListSkeleton from '@/components/PlanCardList/PlanCardListSkeleton';

const TripPlanList = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Layout>
      <ErrorBoundary FallbackComponent={Error} onReset={reset}>
        <Suspense fallback={<PlanCardListSkeleton />}>
          <PlanCardList />
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
  // TODO: padding * 2 + TripPlanCardWidth * 4 + TripPlanCardBoxGap * 3
  min-width: 1364px;
`;

export default TripPlanList;
