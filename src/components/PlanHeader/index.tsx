import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import Description from '@/components/common/Description';
import Spacing from '@/components/common/Spacing';
import color from '@/constants/color';
import { HEADER_HEIGHT } from '@/constants/size';
import useGetDayList from '@/queryHooks/useGetDayList';
import useGetUserProfile from '@/queryHooks/useGetUserProfile';
import { transformDateToDotFormat } from '@/utils/calendar';

const PlanHeader = () => {
  const { id } = useParams();
  // TODO: suspense option 으로 지정할 수 있도록 변경 필요해보임.
  const { data: nickname } = useGetUserProfile({ selectKey: 'nickname' });
  const { data: dayList } = useGetDayList({
    planId: id as string,
  });

  // TODO: planDay date 형식 변경되면 수정 필요한 부분
  const startDate =
    dayList && dayList.length > 1 && dayList[0].date && new Date(2023, 3, 22);
  const endDate =
    dayList &&
    dayList.length > 1 &&
    dayList[dayList.length - 2] &&
    new Date(2023, 4, 12);

  const disabled = !startDate || !endDate;
  const transformedStartDate = disabled
    ? ''
    : transformDateToDotFormat(startDate);
  const transformedEndDate = disabled ? '' : transformDateToDotFormat(endDate);

  return (
    <Box>
      <PlanTitle>{nickname as string}님의 여행</PlanTitle>
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
`;

const PlanTitle = styled.h2`
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

export default PlanHeader;
