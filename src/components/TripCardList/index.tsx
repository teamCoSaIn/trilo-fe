import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

import HTTP from '@/api';
import Button from '@/components/common/Button';
import CircularLoader from '@/components/common/CircularLoader';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import TripCard from '@/components/TripCardList/TripCard';
import TripCardAddBtn from '@/components/TripCardList/TripCardAddBtn/index';
import TripCardListSkeleton from '@/components/TripCardList/TripCardListSkeleton';
import useMedia from '@/hooks/useMedia';
import { UserId } from '@/states/userStatus';

const TRIP_LIST_SIZE = 8;

const TripCardList = () => {
  const { isMobile } = useMedia();

  const userId = useRecoilValue(UserId);

  const {
    data: tripListPageData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['tripList'],
    ({ pageParam = null }) =>
      HTTP.getTripList({
        tripperId: userId,
        tripId: pageParam,
        size: pageParam ? TRIP_LIST_SIZE : TRIP_LIST_SIZE - 1,
      }),
    {
      suspense: true,
      staleTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      getNextPageParam: lastPage => {
        if (!lastPage.hasNext) {
          return;
        }
        return lastPage.trips[lastPage.trips.length - 1].tripId;
      },
    }
  );

  const tripCardList = tripListPageData?.pages.map(tripListData =>
    tripListData?.trips.map(tripData => (
      <TripCard key={tripData.tripId} trip={tripData} />
    ))
  );

  return isFetching && !isFetchingNextPage ? (
    <TripCardListSkeleton />
  ) : (
    <>
      <TripCardListBox isMobile={isMobile}>
        <TripCardAddBtn />
        {tripCardList}
      </TripCardListBox>
      <Spacing height={50} />
      <Flex column alignCenter>
        {hasNextPage && !isFetchingNextPage && (
          <Button type="button" onClick={() => fetchNextPage()}>
            더보기
          </Button>
        )}
        {isFetchingNextPage && <CircularLoader />}
      </Flex>
    </>
  );
};

const TripCardListBox = styled.div<{ isMobile: boolean }>`
  width: 100%;
  display: flex;
  gap: 28px;
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        flex-direction: column;
      `;
    }
    return css`
      flex-wrap: wrap;
    `;
  }}
`;

export default TripCardList;
