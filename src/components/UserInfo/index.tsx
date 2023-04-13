import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import HTTP from '@/api';
import Description from '@/components/common/Description/index';
import Flex from '@/components/common/Flex/index';
import Spacing from '@/components/common/Spacing/index';
import DynamicUserNickname from '@/components/UserInfo/DynamicUserNickname/index';
import color from '@/constants/color';

const UserInfo = () => {
  const { data: userInfo } = useQuery(['userInfo'], () => HTTP.getUserInfo(), {
    staleTime: 30 * 60 * 1000,
    suspense: true,
  });

  return (
    <>
      <ProfileBadge src={userInfo?.badgeImgUrl} />
      <Spacing height={52} />
      <DynamicUserNickname />
      <Spacing height={45} />
      <Flex>
        <Flex column>
          <Description color={color.black} fontSize={3}>
            나의 여정
          </Description>
          <Description color={color.black} fontSize={6}>
            {`${userInfo?.totalDistanceOfPastTrip} KM`}
          </Description>
        </Flex>
        <Spacing width={81} />
        <Flex column>
          <Description color={color.black} fontSize={3}>
            나의 일정
          </Description>
          <Description color={color.black} fontSize={6}>
            {`${userInfo?.totalNumOfTripPlan} 개`}
          </Description>
        </Flex>
      </Flex>
    </>
  );
};

const ProfileBadge = styled.img`
  width: 282px;
  height: 421px;
  border-radius: 36px;
`;

export default UserInfo;
