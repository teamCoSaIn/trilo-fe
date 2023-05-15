import { useQuery } from '@tanstack/react-query';
import React from 'react';
import styled from 'styled-components';

import HTTP from '@/api';
import TripCard from '@/components/TripCardList/TripCard';
import TripCardAddBtn from '@/components/TripCardList/TripCardAddBtn/index';
import TripCardListSkeleton from '@/components/TripCardList/TripCardListSkeleton';

const TripCardList = () => {
  // TODO: 방문자일 때와 로그인일 때 구분

  const { data: tripListData, isFetching } = useQuery(
    ['tripList'],
    () => HTTP.getTripList(),
    {
      suspense: true,
      staleTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  const tripCardList = tripListData?.map(tripData => (
    <TripCard key={tripData.tripId} trip={tripData} />
  ));

  return isFetching ? (
    <TripCardListSkeleton numOfTripCard={tripListData?.length} />
  ) : (
    <TripCardListBox>
      <TripCardAddBtn />
      {tripCardList}
    </TripCardListBox>
  );
};

const TripCardListBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
`;

export default TripCardList;
