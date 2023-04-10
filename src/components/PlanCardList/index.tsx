import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import HTTP from '@/api';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex/index';
import Spacing from '@/components/common/Spacing/index';
import PlanCard from '@/components/PlanCardList/PlanCard';
import PlanCardAddBtn from '@/components/PlanCardList/PlanCardAddBtn/index';
import PlanCardListSkeleton from '@/components/PlanCardList/PlanCardListSkeleton';
import color from '@/constants/color';
import { UserProfileNickname } from '@/states/userProfile';

const PlanCardList = () => {
  // TODO: 방문자일 때와 로그인일 때 구분
  const nickname = useRecoilValue(UserProfileNickname);

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
    <>
      <Flex column>
        <Flex>
          <Description color={color.blue3} fontSize={2.4}>
            {nickname}님의 여행기록
          </Description>
          <Spacing width={14} />
          <Label>{planCardData?.length}개</Label>
        </Flex>
        <Spacing height={13} />
        <Description color="#979696" fontSize={1.4}>
          트릴로와 함께 즐거운 여행을 시작해보세요.
        </Description>
      </Flex>
      <Spacing height={47} />
      <PlanCardsBox>
        <PlanCardAddBtn />
        {PlanCards}
      </PlanCardsBox>
    </>
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

const PlanCardsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
`;

export default PlanCardList;
