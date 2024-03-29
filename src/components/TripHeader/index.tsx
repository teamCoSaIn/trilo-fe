import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import color from '@/constants/color';
import { HEADER_HEIGHT } from '@/constants/size';
import { TRIP_HEADER_Z_INDEX } from '@/constants/zIndex';
import useGetTrip from '@/queryHooks/useGetTrip';
import useGetUserProfile from '@/queryHooks/useGetUserProfile';
import SelectedDates from '@/states/calendar';
import { UserId } from '@/states/userStatus';

const TripHeader = () => {
  const { tripId } = useParams();

  const userId = useRecoilValue(UserId);
  const setSelectedDates = useSetRecoilState(SelectedDates);
  const resetSelectedDates = useResetRecoilState(SelectedDates);

  // TODO: suspense option 으로 지정할 수 있도록 변경 필요해보임.
  const { data: nicknameData } = useGetUserProfile({
    userId,
    selectKey: 'nickName',
  });
  const { data: tripData } = useGetTrip({
    tripId: +(tripId as string),
  });

  const disabled = !tripData?.startDate;
  const transformedStartDate = disabled
    ? ''
    : tripData.startDate.replace(/-/g, '.');
  const transformedEndDate = disabled
    ? ''
    : tripData.endDate.replace(/-/g, '.');

  useEffect(() => {
    if (tripData?.startDate) {
      const [startYear, startMonth, startDay] = tripData.startDate
        .split('-')
        .map(Number);
      const [endYear, endMonth, endDay] = tripData.endDate
        .split('-')
        .map(Number);

      const startDate = tripData?.startDate
        ? new Date(startYear, startMonth - 1, startDay)
        : null;
      const endDate = tripData?.endDate
        ? new Date(endYear, endMonth - 1, endDay)
        : null;
      setSelectedDates([startDate, endDate]);
    } else {
      resetSelectedDates();
    }
  }, [tripData]);

  return (
    <Box>
      <Flex>
        <TripTitle title={nicknameData as string}>
          {nicknameData as string}
        </TripTitle>
        <TripTitleDescription>님의 여행</TripTitleDescription>
      </Flex>
      <Spacing height={10} />
      <Period disabled={disabled}>
        {disabled ? (
          <Description color="gray">여행 일정을 선택해주세요 🙏</Description>
        ) : (
          <>
            {' '}
            <Description>{transformedStartDate}</Description>
            <Spacing width={12} />
            {!disabled && <Description>~</Description>}
            <Spacing width={12} />
            <Description>{transformedEndDate}</Description>
          </>
        )}
      </Period>
    </Box>
  );
};

const Box = styled.div`
  position: absolute;
  top: -${HEADER_HEIGHT}px;
  left: 50%;
  transform: translateX(-50%);
  height: ${HEADER_HEIGHT}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: ${TRIP_HEADER_Z_INDEX};
`;

const TripTitle = styled.h2`
  max-width: 15vw;
  font-size: 1.4rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TripTitleDescription = styled.span`
  flex-shrink: 0;
  font-size: 1.4rem;
  font-weight: 700;
  padding-left: 5px;
`;

const Period = styled.div<{ disabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  height: 33px;
  border-radius: 16px;
  ${({ disabled }) => {
    return css`
      background-color: ${disabled ? color.gray1 : '#ECF0FF'};
    `;
  }}
  font-size: 1.4rem;
  font-weight: 400;
  color: ${color.gray3};
`;

export default TripHeader;
