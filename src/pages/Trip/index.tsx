import { useLoadScript } from '@react-google-maps/api';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import CircularLoader from '@/components/common/CircularLoader';
import DimLoader from '@/components/common/DimLoader';
import Error from '@/components/common/Error';
import Flex from '@/components/common/Flex';
import Portal from '@/components/common/Portal';
import Map from '@/components/Map';
import TripHeader from '@/components/TripHeader';
import TripLeftWindow from '@/components/TripLeftWindow';
import TripRightWindow from '@/components/TripRightWindow';
import useMedia from '@/hooks/useMedia';
import useGetDailyPlanList from '@/queryHooks/useGetDailyPlanList';
import useGetTempPlanPageList from '@/queryHooks/useGetTempPlanPageList';
import useGetTrip from '@/queryHooks/useGetTrip';

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
  const { isMobile, isDesktop } = useMedia();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: `${process.env.GOOGLE_MAPS_API_KEY}`,
    libraries,
  });

  const { tripId } = useParams();

  const { isFetching: isDailyPlanListDataFetching } = useGetDailyPlanList({
    tripId: +(tripId as string),
    enabled: false,
  });

  const { isFetching: isTempPlanPageDataFetching, isFetchingNextPage } =
    useGetTempPlanPageList({
      tripId: +(tripId as string),
      enabled: false,
    });

  const { isFetching: isTripFetching } = useGetTrip({
    tripId: +(tripId as string),
    enabled: false,
  });

  return (
    <Layout>
      <ErrorBoundary FallbackComponent={Error} onReset={reset}>
        <Suspense fallback={<CircularLoader />}>
          {isDesktop && <TripHeader />}
          {isDesktop && <TripLeftWindow />}
          <Wrapper isMobile={isMobile}>
            {isLoaded ? <Map /> : <CircularLoader />}
            <TripRightWindow />
          </Wrapper>

          {(isDailyPlanListDataFetching ||
            (isTempPlanPageDataFetching && !isFetchingNextPage) ||
            isTripFetching) && <Portal childComponent={<DimLoader />} />}
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

const Layout = styled(Flex)`
  position: relative;
  height: 100%;
`;

const Wrapper = styled.div<{ isMobile: boolean }>`
  width: 100%;
  display: flex;
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        display: block;
      `;
    }
  }}
`;

export default Trip;
