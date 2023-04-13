import { useQuery } from '@tanstack/react-query';
import React from 'react';
import styled from 'styled-components';

import HTTP from '@/api';
import PlanCard from '@/components/PlanCardList/PlanCard';
import PlanCardAddBtn from '@/components/PlanCardList/PlanCardAddBtn/index';
import PlanCardListSkeleton from '@/components/PlanCardList/PlanCardListSkeleton';

const PlanCardList = () => {
  // TODO: 방문자일 때와 로그인일 때 구분

  const { data: planCardData, isFetching } = useQuery(
    ['planCardList'],
    () => HTTP.getPlanCardDataList(),
    {
      suspense: true,
      staleTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  const PlanCards = planCardData?.map(cardData => {
    return <PlanCard key={cardData.id} planCardData={cardData} />;
  });

  return isFetching ? (
    <PlanCardListSkeleton numOfPlanCard={planCardData?.length} />
  ) : (
    <PlanCardsBox>
      <PlanCardAddBtn />
      {PlanCards}
    </PlanCardsBox>
  );
};

const PlanCardsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
`;

export default PlanCardList;
