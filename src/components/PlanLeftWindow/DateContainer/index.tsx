import { useRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import color from '@/constants/color';
import SelectedDates from '@/states/calendar';
import { DateInfo } from '@/utils/calendar';

interface DateContainerProps {
  dateInfo: DateInfo;
  dayIndex: number;
  disabled: boolean;
}

const DateContainer = ({
  dateInfo,
  dayIndex,
  disabled,
}: DateContainerProps) => {
  const [[selectedStartDate, selectedEndDate], setSelectedDates] =
    useRecoilState(SelectedDates);

  const startMonth = selectedStartDate ? selectedStartDate.getMonth() + 1 : 0;
  const startDate = selectedStartDate ? selectedStartDate.getDate() : 0;
  const endMonth = selectedEndDate ? selectedEndDate.getMonth() + 1 : 0;
  const endDate = selectedEndDate ? selectedEndDate.getDate() : 0;

  const isStart = startMonth === dateInfo.month && startDate === dateInfo.date;
  const isStartOnRange = isStart && !!endDate;
  const isEnd = endMonth === dateInfo.month && endDate === dateInfo.date;
  const isBetween =
    (startMonth < dateInfo.month ||
      (startMonth === dateInfo.month && startDate < dateInfo.date)) &&
    (endMonth > dateInfo.month ||
      (endMonth === dateInfo.month && endDate > dateInfo.date));

  return disabled ? (
    <DisabledDateBox>{dateInfo.date}</DisabledDateBox>
  ) : (
    <DateBox
      isStartOnRange={isStartOnRange}
      isEnd={isEnd}
      isBetween={isBetween}
    >
      <DateCircle isSunday={dayIndex === 0} isStart={isStart} isEnd={isEnd}>
        {dateInfo.date}
      </DateCircle>
    </DateBox>
  );
};

const DisabledDateBox = styled.td`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  color: ${color.gray2};
`;

const DateBox = styled.td<{
  isStartOnRange: boolean;
  isBetween: boolean;
  isEnd: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  cursor: pointer;
  ${({ isStartOnRange }) => css`
    ${isStartOnRange && {
      background: `linear-gradient(to left, ${color.blue1}, ${color.white})`,
    }}
  `};
  ${({ isBetween }) => css`
    ${isBetween && {
      backgroundColor: color.blue1,
    }}
  `};
  ${({ isEnd }) => css`
    ${isEnd && {
      background: `linear-gradient(to right, ${color.blue1}, ${color.white})`,
    }}
  `};
`;

const DateCircle = styled.div<{
  isSunday: boolean;
  isStart: boolean;
  isEnd: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  font-size: 1.2rem;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid black;
  }
  ${({ isSunday }) => css`
    ${isSunday && {
      color: 'red',
    }}
  `};
  ${({ isStart, isEnd }) => css`
    ${(isStart || isEnd) && {
      color: color.white,
      backgroundColor: color.blue3,
    }}
  `};
`;

export default DateContainer;
