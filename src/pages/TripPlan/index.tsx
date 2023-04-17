import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Error from '@/components/common/Error';
import CircularLoader from '@/components/common/Loader';
import PlanLeftWindow from '@/components/PlanLeftWindow';
import PlanRightWindow from '@/components/PlanRightWindow';

const TripPlan = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary FallbackComponent={Error} onReset={reset}>
      <Suspense fallback={<CircularLoader />}>
        <PlanLeftWindow />
        <div>GoogleMap</div>
        <PlanRightWindow />
      </Suspense>
    </ErrorBoundary>
  );
};

export default TripPlan;
