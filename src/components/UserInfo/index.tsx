import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import HTTP from '@/api';
import CircularLoader from '@/components/common/CircularLoader';
import Description from '@/components/common/Description/index';
import Spacing from '@/components/common/Spacing/index';
import DynamicUserNickname from '@/components/UserInfo/DynamicUserNickname/index';
import color from '@/constants/color';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

const UserInfo = () => {
  const { data: userInfoData } = useQuery(
    ['userInfo'],
    () => HTTP.getUserInfo(),
    {
      staleTime: 30 * 60 * 1000,
      suspense: true,
    }
  );
  const setUserStatus = useSetRecoilState(UserStatus);
  const navigate = useNavigate();
  const { isLoading, mutate } = useMutation(['resign'], () => HTTP.resign(), {
    onSuccess: () => {
      navigate('/');
      // navigate 동작을 위해 setTimeout 으로 userStatus 변경 시점을 늦춤
      setTimeout(() => {
        setUserStatus(UserStatusTypes.LOGOUT);
      });
    },
    onError: () => {
      alert('탈퇴 실패');
    },
  });

  const handleResignBtnClick = () => {
    if (window.confirm('정말 탈퇴하시겠습니까?')) {
      mutate();
    }
  };

  const totalDistance = userInfoData?.totalDistanceOfPastTrip
    ? userInfoData.totalDistanceOfPastTrip.toLocaleString()
    : 0;

  const totalTrip = userInfoData?.totalNumOfTrip
    ? userInfoData.totalNumOfTrip
    : 0;

  return (
    <>
      <ProfileBadge src={userInfoData?.badgeImgUrl} />
      <Spacing height={30} />
      <DynamicUserNickname />
      <Spacing height={24} />
      <InfoBox backgroundColor={color.white}>
        <InfoKey color={color.blue3} fontSize={1.6}>
          나의 여정
        </InfoKey>
        <FlexibleSpacing />
        <InfoValueBox>
          <InfoValue color={color.gray3} fontSize={1.6}>
            {totalDistance}
          </InfoValue>
          <InfoValueUnit color={color.gray3} fontSize={1.6}>
            KM
          </InfoValueUnit>
        </InfoValueBox>
      </InfoBox>
      <Spacing height={24} />
      <InfoBox backgroundColor={color.white}>
        <InfoKey color={color.blue3} fontSize={1.6}>
          나의 일정
        </InfoKey>
        <FlexibleSpacing />
        <InfoValueBox>
          <InfoValue color={color.gray3} fontSize={1.6}>
            {totalTrip}
          </InfoValue>
          <InfoValueUnit color={color.gray3} fontSize={1.6}>
            개
          </InfoValueUnit>
        </InfoValueBox>
      </InfoBox>
      <Spacing height={95} />
      <ResignBtn onClick={handleResignBtnClick} disabled={isLoading}>
        {isLoading ? <CircularLoader /> : '회원 탈퇴하기'}
      </ResignBtn>
    </>
  );
};

const ProfileBadge = styled.img`
  height: 436px;
  border-radius: 36px;
  object-fit: cover;
`;

const InfoBox = styled.div<{ backgroundColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 307px;
  height: 70px;
  padding: 0 50px;
  border-radius: 48px;
  ${({ backgroundColor }) => css`
    ${backgroundColor && { backgroundColor }}
  `};
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
`;

const FlexibleSpacing = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 10px;
`;

const InfoValueBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const InfoKey = styled(Description)`
  flex-shrink: 0;
`;

const InfoValue = styled(Description)`
  text-align: right;
  word-wrap: break-word;
  word-break: break-all;
`;

const InfoValueUnit = styled(Description)``;

const ResignBtn = styled.button`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${color.gray2};
  &:not(:disabled) {
    border-bottom: 1px solid ${color.gray2};
  }
`;

export default UserInfo;
