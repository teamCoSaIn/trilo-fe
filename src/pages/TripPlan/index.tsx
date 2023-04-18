import { useLoadScript } from '@react-google-maps/api';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Error from '@/components/common/Error';
import CircularLoader from '@/components/common/Loader';
import Map from '@/components/Map';
import PlanLeftWindow from '@/components/PlanLeftWindow';
import PlanRightWindow from '@/components/PlanRightWindow';

type Libraries = (
  | 'places'
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'visualization'
)[];

const libraries: Libraries = ['places'];

const TripPlan = () => {
  const { reset } = useQueryErrorResetBoundary();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: `${process.env.GOOGLE_MAPS_API_KEY}`,
    libraries,
  });

  return (
    <ErrorBoundary FallbackComponent={Error} onReset={reset}>
      <Suspense fallback={<CircularLoader />}>
        <PlanLeftWindow />
        {isLoaded ? <Map /> : <div>loading...</div>}
        <PlanRightWindow />
      </Suspense>
    </ErrorBoundary>
  );
};

export default TripPlan;
