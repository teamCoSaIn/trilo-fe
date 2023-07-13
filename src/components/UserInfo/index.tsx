import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import HTTP from '@/api';
import CircularLoader from '@/components/common/CircularLoader';
import Description from '@/components/common/Description/index';
import Spacing from '@/components/common/Spacing/index';
import DynamicUserNickname from '@/components/UserInfo/DynamicUserNickname/index';
import color from '@/constants/color';
import useMedia from '@/hooks/useMedia';
import useGetUserInfo from '@/queryHooks/useGetUserInfo';
import UserStatus, { UserId, UserStatusTypes } from '@/states/userStatus';

const UserInfo = () => {
  const { isMobile } = useMedia();

  const navigate = useNavigate();

  const userId = useRecoilValue(UserId);
  const setUserStatus = useSetRecoilState(UserStatus);

  const { data: userInfoData } = useGetUserInfo(userId);
  const { isLoading, mutate } = useMutation(
    ['resign'],
    () => HTTP.resign(userId),
    {
      onSuccess: () => {
        toast.success('탈퇴가 완료되었습니다.', {
          position: 'top-center',
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        });
        navigate('/');
        setTimeout(() => {
          setUserStatus(UserStatusTypes.LOGOUT);
        });
      },
      onError: (
        err: AxiosError<{
          errorCode?: string;
          errorDetail?: string;
          errorMessage?: string;
        }>
      ) => {
        if (err.response?.data?.errorDetail) {
          toast.error(err.response.data.errorDetail, {
            autoClose: 3000,
            pauseOnHover: false,
            draggable: false,
          });
        } else {
          toast.error('Server Error', {
            autoClose: 3000,
            pauseOnHover: false,
            draggable: false,
          });
        }
      },
    }
  );

  const handleResignBtnClick = () => {
    if (window.confirm('정말 탈퇴하시겠습니까?')) {
      mutate();
    }
  };

  const totalTrip = userInfoData?.tripStatistics.totalTripCnt;
  const terminatedTrip = userInfoData?.tripStatistics.terminatedTripCnt;

  return (
    <>
      <ProfileBadge
        src={userInfoData?.imageURL}
        alt="user profile badge"
        isMobile={isMobile}
      />
      <Spacing height={30} />
      <DynamicUserNickname />
      <Spacing height={24} />
      <InfoBox backgroundColor={color.white} isMobile={isMobile}>
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
      <Spacing height={24} />
      <InfoBox backgroundColor={color.white} isMobile={isMobile}>
        <InfoKey color={color.blue3} fontSize={1.6}>
          완료된 일정
        </InfoKey>
        <FlexibleSpacing />
        <InfoValueBox>
          <InfoValue color={color.gray3} fontSize={1.6}>
            {terminatedTrip}
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

const ProfileBadge = styled.img<{ isMobile: boolean }>`
  border-radius: 36px;
  object-fit: cover;
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        width: 50vw;
        min-width: 250px;
        max-width: 310px;
      `;
    }
    return css`
      width: 30vw;
      min-width: 310px;
      max-width: 400px;
    `;
  }}
`;

const InfoBox = styled.div<{ backgroundColor?: string; isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 0 50px;
  border-radius: 48px;
  ${({ backgroundColor }) => css`
    ${backgroundColor && { backgroundColor }}
  `};
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        width: 250px;
        height: 50px;
      `;
    }
    return css`
      width: 310px;
      height: 70px;
    `;
  }}
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
