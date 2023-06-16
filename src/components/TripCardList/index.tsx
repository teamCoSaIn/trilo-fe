import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import styled from 'styled-components';

import HTTP from '@/api';
import Button from '@/components/common/Button';
import CircularLoader from '@/components/common/CircularLoader';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import TripCard from '@/components/TripCardList/TripCard';
import TripCardAddBtn from '@/components/TripCardList/TripCardAddBtn/index';
import TripCardListSkeleton from '@/components/TripCardList/TripCardListSkeleton';

const TripCardList = () => {
  // TODO: 방문자일 때와 로그인일 때 구분

  const {
    data: tripListPageData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['tripList'],
    ({ pageParam = 0 }) =>
      HTTP.getTripList({ 'tripper-id': 0, page: pageParam, size: 5 }),
    {
      suspense: true,
      staleTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.hasNext) {
          return;
        }
        return allPages.length;
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
      <TripCardListBox>
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

const TripCardListBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
`;

export default TripCardList;
