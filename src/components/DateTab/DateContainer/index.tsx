import { useRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import color from '@/constants/color';
import SelectedDates from '@/states/calendar';
import { IDateInfo } from '@/utils/calendar';

interface IDateContainerProps {
  dateInfo: IDateInfo;
  dayIndex: number;
  disabled: boolean;
}

const DateContainer = ({
  dateInfo,
  dayIndex,
  disabled,
}: IDateContainerProps) => {
  const [[selectedStartDate, selectedEndDate], setSelectedDates] =
    useRecoilState(SelectedDates);

  const startYear = selectedStartDate ? selectedStartDate.getFullYear() : 0;
  const startMonth = selectedStartDate ? selectedStartDate.getMonth() + 1 : 0;
  const startDate = selectedStartDate ? selectedStartDate.getDate() : 0;
  const endYear = selectedEndDate ? selectedEndDate.getFullYear() : 0;
  const endMonth = selectedEndDate ? selectedEndDate.getMonth() + 1 : 0;
  const endDate = selectedEndDate ? selectedEndDate.getDate() : 0;

  const isStartSameEnd =
    !!selectedStartDate &&
    !!selectedEndDate &&
    startYear === endYear &&
    startMonth === endMonth &&
    startDate === endDate;
  const isStart =
    startYear === dateInfo.year &&
    startMonth === dateInfo.month &&
    startDate === dateInfo.date;
  const isStartOnRange = isStart && !!endDate && !isStartSameEnd;
  const isEnd =
    endYear === dateInfo.year &&
    endMonth === dateInfo.month &&
    endDate === dateInfo.date &&
    !isStartSameEnd;
  const isBetween =
    (startYear < dateInfo.year ||
      (startYear === dateInfo.year && startMonth < dateInfo.month) ||
      (startYear === dateInfo.year &&
        startMonth === dateInfo.month &&
        startDate < dateInfo.date)) &&
    (endYear > dateInfo.year ||
      (endYear === dateInfo.year && endMonth > dateInfo.month) ||
      (endYear === dateInfo.year &&
        endMonth === dateInfo.month &&
        endDate > dateInfo.date));
  const isBeforeStart =
    startYear > dateInfo.year ||
    (startYear === dateInfo.year && startMonth > dateInfo.month) ||
    (startYear === dateInfo.year &&
      startMonth === dateInfo.month &&
      startDate > dateInfo.date);

  const handleDateBoxClick = () => {
    if (disabled) return;
    if (!selectedStartDate && !selectedEndDate) {
      setSelectedDates([
        new Date(dateInfo.year, dateInfo.month - 1, dateInfo.date),
        null,
      ]);
    }
    if (selectedStartDate && !selectedEndDate) {
      if (isBeforeStart) {
        setSelectedDates([
          new Date(dateInfo.year, dateInfo.month - 1, dateInfo.date),
          null,
        ]);
      } else {
        setSelectedDates(prev => [
          prev[0],
          new Date(dateInfo.year, dateInfo.month - 1, dateInfo.date),
        ]);
      }
    }
    if (selectedStartDate && selectedEndDate) {
      if (isBeforeStart) {
        setSelectedDates([
          new Date(dateInfo.year, dateInfo.month - 1, dateInfo.date),
          null,
        ]);
      } else {
        setSelectedDates(prev => [
          prev[0],
          new Date(dateInfo.year, dateInfo.month - 1, dateInfo.date),
        ]);
      }
    }
  };

  return (
    <DateBox
      isStartOnRange={isStartOnRange}
      isEnd={isEnd}
      isBetween={isBetween}
      onClick={handleDateBoxClick}
      disabled={disabled}
    >
      <DateCircle
        isSunday={dayIndex === 0}
        isStart={isStart}
        isEnd={isEnd}
        disabled={disabled}
      >
        {dateInfo.date}
      </DateCircle>
    </DateBox>
  );
};

const DateBox = styled.td<{
  isStartOnRange: boolean;
  isBetween: boolean;
  isEnd: boolean;
  disabled: boolean;
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
  disabled: boolean;
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
    ${({ disabled }) => {
      if (disabled) {
        return css`
          border: 1px solid ${color.gray2};
        `;
      }
      return css`
        border: 1px solid black;
      `;
    }};
  }
  ${({ isSunday, disabled }) => {
    if (isSunday && !disabled) {
      return css`
        color: red;
      `;
    }
    if (disabled) {
      return css`
        color: ${color.gray2};
      `;
    }
  }};
  ${({ isStart, isEnd }) => css`
    ${(isStart || isEnd) && {
      color: color.white,
      backgroundColor: color.blue3,
    }}
  `};
`;

export default DateContainer;
