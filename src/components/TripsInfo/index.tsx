import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex/index';
import Spacing from '@/components/common/Spacing/index';
import color from '@/constants/color';
import useMedia from '@/hooks/useMedia';
import useGetUserInfo from '@/queryHooks/useGetUserInfo';
import useGetUserProfile from '@/queryHooks/useGetUserProfile';
import { UserId } from '@/states/userStatus';

const TripsInfo = () => {
  const { isMobile } = useMedia();

  const userId = useRecoilValue(UserId);

  const { data: nicknameData } = useGetUserProfile({
    userId,
    selectKey: 'nickName',
  });
  const { data: userInfoData } = useGetUserInfo(userId);

  const totalTrip = userInfoData?.tripStatistics.totalTripCnt;

  return (
    <Flex column>
      <Flex alignCenter>
        <Description color={color.blue3} fontSize={isMobile ? 2 : 2.4}>
          {nicknameData as string}님의 여행기록
        </Description>
        <Spacing width={14} />
        <Label>{totalTrip} 개</Label>
      </Flex>
      <Spacing height={16} />
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
  flex-shrink: 0;
`;

export default TripsInfo;
