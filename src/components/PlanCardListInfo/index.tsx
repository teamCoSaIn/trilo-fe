import React from 'react';
import styled from 'styled-components';

import HTTP from '@/api';
import { PlanCardData } from '@/api/tripPlanList';
import { UserProfile } from '@/api/userInfo';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex/index';
import Spacing from '@/components/common/Spacing/index';
import color from '@/constants/color';
import useQueries2 from '@/utils/useQueries2';

const PlanCardListInfo = () => {
  const [{ data: nickname }, { data: numOfPlanCards }] = useQueries2({
    queries: [
      {
        queryKey: ['userProfile'],
        queryFn: HTTP.getUserProfile,
        staleTime: Infinity,
        cacheTime: Infinity,
        suspense: true,
        select: (data: UserProfile) => data.nickname,
      },
      {
        queryKey: ['planCardList'],
        queryFn: HTTP.getPlanCardDataList,
        staleTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        suspense: true,
        select: (data: PlanCardData[]) => data.length,
      },
    ],
  });

  return (
    <Flex column>
      <Flex>
        <Description color={color.blue3} fontSize={2.4}>
          {nickname}님의 여행기록
        </Description>
        <Spacing width={14} />
        <Label>{numOfPlanCards}개</Label>
      </Flex>
      <Spacing height={13} />
      <Description color="#979696" fontSize={1.4}>
        트릴로와 함께 즐거운 여행을 시작해보세요.
      </Description>
    </Flex>
  );
};

// TODO: common 분리
const Label = styled.div`
  width: 52px;
  height: 23px;
  border-radius: 15px;
  background-color: #4d77ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.4rem;
`;

export default PlanCardListInfo;
