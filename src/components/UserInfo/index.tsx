import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import HTTP from '@/api';
import Description from '@/components/common/Description/index';
import Spacing from '@/components/common/Spacing/index';
import UserNickname from '@/components/UserNickname/index';
import color from '@/constants/color';

const UserInfo = () => {
  const { data: userInfo } = useQuery(['userInfo'], () => HTTP.getUserInfo(), {
    staleTime: 30 * 60 * 1000,
    suspense: true,
  });

  return (
    <>
      <TripBadge src={userInfo?.badgeImgUrl} />
      <Spacing height={52} />
      <UserNickname />
      <Spacing height={45} />
      <TripInfoBox>
        <TotalDistanceOfPastTrip>
          <Description color={color.black} fontSize={3}>
            나의 여정
          </Description>
          <Description color={color.black} fontSize={6}>
            {`${userInfo?.totalDistanceOfPastTrip} KM`}
          </Description>
        </TotalDistanceOfPastTrip>
        <TotalNumOfTrip>
          <Description color={color.black} fontSize={3}>
            나의 일정
          </Description>
          <Description color={color.black} fontSize={6}>
            {`${userInfo?.totalNumOfTrip} 개`}
          </Description>
        </TotalNumOfTrip>
      </TripInfoBox>
    </>
  );
};

const TripBadge = styled.img`
  width: 282px;
  height: 421px;
  border-radius: 36px;
`;

const TripInfoBox = styled.div`
  display: flex;
  gap: 81px;
`;

const TotalDistanceOfPastTrip = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const TotalNumOfTrip = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export default UserInfo;
