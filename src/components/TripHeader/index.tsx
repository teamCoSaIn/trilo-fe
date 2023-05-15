import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import Description from '@/components/common/Description';
import Spacing from '@/components/common/Spacing';
import color from '@/constants/color';
import { HEADER_HEIGHT } from '@/constants/size';
import { TRIP_HEADER_Z_INDEX } from '@/constants/zIndex';
import useGetDailyPlanList from '@/queryHooks/useGetDailyPlanList';
import useGetUserProfile from '@/queryHooks/useGetUserProfile';
import SelectedDates from '@/states/calendar';
import { transformDateToDotFormat } from '@/utils/calendar';

const TripHeader = () => {
  const { tripId } = useParams();
  // TODO: suspense option 으로 지정할 수 있도록 변경 필요해보임.
  const { data: nicknameData } = useGetUserProfile({ selectKey: 'nickname' });
  const { data: dailyPlanListData } = useGetDailyPlanList({
    tripId: +(tripId as string),
  });
  const setSelectedDates = useSetRecoilState(SelectedDates);

  const startDate =
    dailyPlanListData &&
    dailyPlanListData[0]?.date &&
    new Date(dailyPlanListData[0].date);
  const endDateData =
    dailyPlanListData && dailyPlanListData[dailyPlanListData.length - 2]?.date;
  const endDate = endDateData && new Date(endDateData);

  const disabled = !startDate || !endDate;
  const transformedStartDate = disabled
    ? ''
    : transformDateToDotFormat(startDate);
  const transformedEndDate = disabled ? '' : transformDateToDotFormat(endDate);

  useEffect(() => {
    if (startDate && endDate) {
      setSelectedDates([startDate, endDate]);
    }
  }, [startDate, endDate]);

  return (
    <Box>
      <TripTitle>{nicknameData as string}님의 여행</TripTitle>
      <Spacing height={10} />
      <Period disabled={disabled}>
        <Description>{transformedStartDate}</Description>
        <Spacing width={12} />
        <Description>~</Description>
        <Spacing width={12} />
        <Description>{transformedEndDate}</Description>
      </Period>
    </Box>
  );
};

const Box = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: ${HEADER_HEIGHT};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: ${TRIP_HEADER_Z_INDEX};
`;

const TripTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
`;

const Period = styled.div<{ disabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 204px;
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
