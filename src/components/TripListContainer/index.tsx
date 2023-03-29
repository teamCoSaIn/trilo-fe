import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import HTTP from '@/api';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex/index';
import Spacing from '@/components/common/Spacing/index';
import TripCard from '@/components/TripCard';
import color from '@/constants/color';
import { UserProfileNickname } from '@/states/userProfile';

const TripListContainer = () => {
  // TODO: 방문자일 때와 로그인일 때 구분
  const nickname = useRecoilValue(UserProfileNickname);

  const { data: tripCardData } = useQuery(
    ['tripList'],
    () => HTTP.getTripList(),
    {
      suspense: true,
    }
  );

  const TripCards = tripCardData?.map(cardData => {
    return <TripCard key={cardData.id} cardData={cardData} />;
  });

  return (
    <>
      <Flex column>
        <Flex>
          <Description color={color.blue3} fontSize={2.4}>
            {nickname}님의 여행기록
          </Description>
          <Spacing width={14} />
          <Label>{tripCardData?.length}개</Label>
        </Flex>
        <Spacing height={13} />
        <Description color="#979696" fontSize={1.4}>
          트릴로와 함께 즐거운 여행을 시작해보세요.
        </Description>
      </Flex>
      <Spacing height={47} />
      <TripCardsBox>{TripCards}</TripCardsBox>
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

const TripCardsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
`;

export default TripListContainer;
