import { useMutation, useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import HTTP from '@/api';
import Description from '@/components/common/Description/index';
import CircularLoader from '@/components/common/Loader';
import Spacing from '@/components/common/Spacing/index';
import DynamicUserNickname from '@/components/UserInfo/DynamicUserNickname/index';
import color from '@/constants/color';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

const UserInfo = () => {
  const { data: userInfo } = useQuery(['userInfo'], () => HTTP.getUserInfo(), {
    staleTime: 30 * 60 * 1000,
    suspense: true,
  });
  const setUserStatus = useSetRecoilState(UserStatus);
  const { isLoading, mutate } = useMutation(['resign'], () => HTTP.resign(), {
    onSuccess: () => {
      setUserStatus(UserStatusTypes.LOGOUT);
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

  return (
    <>
      <ProfileBadge src={userInfo?.badgeImgUrl} />
      <Spacing height={24} />
      <DynamicUserNickname />
      <Spacing height={12} />
      <ProfileBox backgroundColor={color.white}>
        <ProfileKey color={color.blue3} fontSize={1.6}>
          나의 여정
        </ProfileKey>
        <ProfileValue color={color.gray3} fontSize={1.6}>
          {`${userInfo?.totalDistanceOfPastTrip} KM`}
        </ProfileValue>
      </ProfileBox>
      <Spacing height={12} />
      <ProfileBox backgroundColor={color.white}>
        <ProfileKey color={color.blue3} fontSize={1.6}>
          나의 일정
        </ProfileKey>
        <ProfileValue color={color.gray3} fontSize={1.6}>
          {`${userInfo?.totalNumOfTripPlan} 개`}
        </ProfileValue>
      </ProfileBox>
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

const ProfileBox = styled.div<{ backgroundColor?: string }>`
  position: relative;
  width: 307px;
  height: 50px;
  border-radius: 48px;
  ${({ backgroundColor }) => css`
    ${backgroundColor && { backgroundColor }}
  `};
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
`;

const ProfileKey = styled(Description)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 55px;
`;

const ProfileValue = styled(Description)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 211px;
`;

const ResignBtn = styled.button`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${color.gray2};
  &:not(:disabled) {
    border-bottom: 1px solid ${color.gray2};
  }
`;

export default UserInfo;
