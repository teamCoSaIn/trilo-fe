import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import HTTP from '@/api';
import Description from '@/components/common/Description';
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
    return <TripCard cardData={cardData} />;
  });

  return (
    <>
      <DescriptionBox>
        <Wrapper>
          <Description color={color.blue3} fontSize={2.4}>
            {nickname}님의 여행기록
          </Description>
          <Spacing width={14} />
          <Label>{tripCardData?.length}개</Label>
        </Wrapper>
        <Spacing height={13} />
          트릴로와 함께 즐거운 여행을 시작해보세요.
        </Description>
      </DescriptionBox>
      <Spacing height={47} />
      <TripCardsBox>{TripCards}</TripCardsBox>
    </>
  );
};

const DescriptionBox = styled.div`
  min-width: 600px;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
`;

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
  min-width: 600px;
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
  margin-top: 47px;
`;

export default TripListContainer;
