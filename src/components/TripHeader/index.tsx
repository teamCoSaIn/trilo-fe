import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import Description from '@/components/common/Description';
import Spacing from '@/components/common/Spacing';
import color from '@/constants/color';
import { HEADER_HEIGHT } from '@/constants/size';
import { TRIP_HEADER_Z_INDEX } from '@/constants/zIndex';
import useGetTrip from '@/queryHooks/useGetTrip';
import useGetUserProfile from '@/queryHooks/useGetUserProfile';
import SelectedDates from '@/states/calendar';

const TripHeader = () => {
  const { tripId } = useParams();

  const setSelectedDates = useSetRecoilState(SelectedDates);

  // TODO: suspense option 으로 지정할 수 있도록 변경 필요해보임.
  const { data: nicknameData } = useGetUserProfile({ selectKey: 'nickname' });
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
    const startDate = tripData?.startDate ? new Date(tripData.startDate) : null;
    const endDate = tripData?.endDate ? new Date(tripData.endDate) : null;
    setSelectedDates([startDate, endDate]);
  }, [tripData]);

  return (
    <Box>
      <TripTitle>{nicknameData as string}님의 여행</TripTitle>
      <Spacing height={10} />
      <Period disabled={disabled}>
        <Description>{transformedStartDate}</Description>
        <Spacing width={12} />
        {!disabled && <Description>~</Description>}
        <Spacing width={12} />
        <Description>{transformedEndDate}</Description>
      </Period>
    </Box>
  );
};

const Box = styled.div`
  position: absolute;
  top: -${HEADER_HEIGHT};
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
