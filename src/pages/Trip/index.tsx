import { useLoadScript } from '@react-google-maps/api';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

import Error from '@/components/common/Error';
import Flex from '@/components/common/Flex';
import CircularLoader from '@/components/common/Loader';
import Map from '@/components/Map';
import TripHeader from '@/components/TripHeader';
import TripLeftWindow from '@/components/TripLeftWindow';
import TripRightWindow from '@/components/TripRightWindow';

type TLibraries = (
  | 'places'
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'visualization'
)[];

const libraries: TLibraries = ['places'];

const Trip = () => {
  const { reset } = useQueryErrorResetBoundary();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: `${process.env.GOOGLE_MAPS_API_KEY}`,
    libraries,
  });

  return (
    <ErrorBoundary FallbackComponent={Error} onReset={reset}>
      <Suspense fallback={<CircularLoader />}>
        <TripHeader />
        <TripLeftWindow />
        <Box>
          {isLoaded ? <Map /> : <div>loading...</div>}
          <TripRightWindow />
        </Box>
      </Suspense>
    </ErrorBoundary>
  );
};

const Box = styled(Flex)`
  width: 100%;
  height: 100%;
`;

export default Trip;