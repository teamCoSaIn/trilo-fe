/*
TODO:
- click away listener 추가
- startTime > endTime 막기
*/

import { useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as RefreshIcon } from '@/assets/refresh.svg';

const TimePicker = () => {
  const INITIAL_HOUR = 'HH';
  const INITIAL_MINUTE = 'MM';
  const INITIAL_SELECTED_ID = -1;

  const [hour, setHour] = useState(INITIAL_HOUR);
  const [minute, setMinute] = useState(INITIAL_MINUTE);
  const [isRefreshIconVisible, setIsRefreshIconVisible] = useState(false);
  const [isTimeOptionVisible, setIsTimeOptionVisible] = useState(false);
  const [isHourOptionsScrollVisible, setIsHourOptionsScrollVisible] =
    useState(false);
  const [isMinuteOptionsScrollVisible, setIsMinuteOptionsScrollVisible] =
    useState(false);
  const [selectedHourId, setSelectedHourId] =
    useState<number>(INITIAL_SELECTED_ID);
  const [selectedMinuteId, setSelectedMinuteId] =
    useState<number>(INITIAL_SELECTED_ID);

  const hourDataList = Array.from({ length: 24 }, (_, i) => i);
  const minuteDataList = Array.from({ length: 12 }, (_, i) => i * 5);

  const resetTimePicker = () => {
    setHour(INITIAL_HOUR);
    setMinute(INITIAL_MINUTE);
    setSelectedHourId(INITIAL_SELECTED_ID);
    setSelectedMinuteId(INITIAL_SELECTED_ID);
  };

  const handleTimePickerClick = () => {
    setIsTimeOptionVisible(prev => !prev);
    if (hour === INITIAL_HOUR || minute === INITIAL_MINUTE) {
      resetTimePicker();
    }
  };

  const handleTimePickerMouseEnter = () => {
    setIsRefreshIconVisible(true);
  };

  const handleTimePickerMouseLeave = () => {
    setIsRefreshIconVisible(false);
  };

  const handleRefreshBtnClick = (event: React.MouseEvent) => {
    resetTimePicker();
    event.stopPropagation();
  };

  const handleHourOptionsMouseEnter = () => {
    setIsHourOptionsScrollVisible(true);
  };

  const handleHourOptionsMouseLeave = () => {
    setIsHourOptionsScrollVisible(false);
  };

  const handleMinuteOptionsMouseEnter = () => {
    setIsMinuteOptionsScrollVisible(true);
  };

  const handleMinuteOptionsMouseLeave = () => {
    setIsMinuteOptionsScrollVisible(false);
  };

  const handleHourOptionsClick = (paddedHour: string, id: number) => () => {
    setHour(paddedHour);
    setSelectedHourId(id);
    // if (minute !== INITIAL_MINUTE) {
    //   // post 요청
    //   setIsTimeOptionVisible(false);
    // }
  };

  const handleMinuteOptionsClick = (paddedMinute: string, id: number) => () => {
    setMinute(paddedMinute);
    setSelectedMinuteId(id);
    if (hour !== INITIAL_HOUR) {
      // post 요청
      setIsTimeOptionVisible(false);
    }
  };

  const hourOptions = hourDataList.map((hourData, idx) => {
    const paddedHour = `${hourData}`.padStart(2, '0');
    return (
      <TimeOptionsItem
        key={idx}
        optionId={idx}
        onClick={handleHourOptionsClick(paddedHour, idx)}
        selectedOptionId={selectedHourId}
      >
        {paddedHour}
      </TimeOptionsItem>
    );
  });
  const minuteOptions = minuteDataList.map((minuteData, idx) => {
    const paddedMinute = `${minuteData}`.padStart(2, '0');
    return (
      <TimeOptionsItem
        key={idx}
        optionId={idx}
        onClick={handleMinuteOptionsClick(paddedMinute, idx)}
        selectedOptionId={selectedMinuteId}
      >
        {paddedMinute}
      </TimeOptionsItem>
    );
  });

  return (
    <TimePickerBox>
      <TimePickerContent
        onClick={handleTimePickerClick}
        onMouseEnter={handleTimePickerMouseEnter}
        onMouseLeave={handleTimePickerMouseLeave}
      >
        {`${hour} : ${minute}`}
        {isRefreshIconVisible && (
          <RefreshBtn type="button" onClick={handleRefreshBtnClick}>
            <RefreshIcon width={10} height={10} />
          </RefreshBtn>
        )}
      </TimePickerContent>
      <TimeOptionsDropdown isTimeOptionVisible={isTimeOptionVisible}>
        <TimeOptionsListBox>
          <TimeOptionsList
            onMouseEnter={handleHourOptionsMouseEnter}
            onMouseLeave={handleHourOptionsMouseLeave}
            isVisible={isHourOptionsScrollVisible}
          >
            {hourOptions}
          </TimeOptionsList>
          <TimeOptionsList
            onMouseEnter={handleMinuteOptionsMouseEnter}
            onMouseLeave={handleMinuteOptionsMouseLeave}
            isVisible={isMinuteOptionsScrollVisible}
          >
            {minuteOptions}
          </TimeOptionsList>
        </TimeOptionsListBox>
      </TimeOptionsDropdown>
    </TimePickerBox>
  );
};

const TimePickerBox = styled.div`
  position: relative;
`;

const TimePickerContent = styled.div`
  position: relative;
  width: 90px;
  height: 20px;
  display: flex;
  justify-content: center;
  background-color: #f6f6f6;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  color: #4f4f4f;
  font-size: 12px;
  line-height: 20px;
  transition: border-color 0.2s;
  &:hover {
    border-color: #4096ff;
  }
  cursor: pointer;
`;

const RefreshBtn = styled.button`
  position: absolute;
  right: 5px;
  line-height: 20px;
  &:hover svg {
    fill: #4096ff;
  }
`;

const TimeOptionsDropdown = styled.div<{ isTimeOptionVisible: boolean }>`
  max-height: ${({ isTimeOptionVisible }) =>
    isTimeOptionVisible ? '180px' : '0px'};
  overflow: hidden;
  transition: max-height 0.1s ease-out;
  position: absolute;
  top: 22px;
  left: 0px;
  width: 90px;
  height: 180px;
  /* border: 1px solid #d9d9d9; */
  background-color: #fff;
  border-radius: 5px;
  color: #4f4f4f;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
`;

const TimeOptionsListBox = styled.div`
  display: flex;
`;

const TimeOptionsList = styled.ul<{ isVisible: boolean }>`
  width: 50%;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 2px 0 2px 4px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 20px;
    display: ${({ isVisible }) => !isVisible && 'none'};
  }
`;

const TimeOptionsItem = styled.li<{
  optionId: number;
  selectedOptionId: number;
}>`
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 5px;
  background-color: ${({ optionId, selectedOptionId }) =>
    optionId === selectedOptionId ? '#e6f4ff' : 'none'};
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  cursor: pointer;
`;

export default TimePicker;
