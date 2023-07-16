import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as RefreshIcon } from '@/assets/refresh.svg';
import { TIMEPICKER_Z_INDEX } from '@/constants/zIndex';
import useMedia from '@/hooks/useMedia';

interface ITimePickerProps {
  time: string | undefined;
  setTime: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const DEFAULT_HOUR = '00';
const DEFAULT_MINUTE = '00';

const TimePicker = ({ time, setTime }: ITimePickerProps) => {
  const { isDesktop, isMobile } = useMedia();

  const [initHour, initMinute] = (time || '').split(':').slice(0, 2);
  const [hour, setHour] = useState(initHour);
  const [minute, setMinute] = useState(initMinute);
  const [hourScrollIndex, setHourScrollIndex] = useState(0);
  const [minuteScrollIndex, setMinuteScrollIndex] = useState(0);

  const [isRefreshIconVisible, setIsRefreshIconVisible] = useState(false);
  const [isTimeOptionsVisible, setIsTimeOptionsVisible] = useState(false);
  const [isHourOptionsScrollVisible, setIsHourOptionsScrollVisible] =
    useState(false);
  const [isMinuteOptionsScrollVisible, setIsMinuteOptionsScrollVisible] =
    useState(false);

  const timeOptionsRef = useRef<HTMLDivElement>(null);
  const hourOptionsRef = useRef<HTMLUListElement>(null);
  const minuteOptionsRef = useRef<HTMLUListElement>(null);

  const hourDataList = Array.from({ length: 24 }, (_, i) => i);
  const minuteDataList = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleClickAway = (event: MouseEvent) => {
    event.stopPropagation();
    if (event.target !== timeOptionsRef.current) {
      setIsTimeOptionsVisible(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (isTimeOptionsVisible && isDesktop) {
        document.addEventListener('click', handleClickAway);
      }
    }, 0);
    return () => {
      if (isTimeOptionsVisible) {
        document.removeEventListener('click', handleClickAway);
      }
    };
  }, [isTimeOptionsVisible]);

  useEffect(() => {
    if (isMobile) {
      setIsTimeOptionsVisible(false);
    }
  }, [isMobile]);

  const handleTimePickerMouseEnter = () => {
    setIsRefreshIconVisible(true);
  };
  const handleTimePickerMouseLeave = () => {
    setIsRefreshIconVisible(false);
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

  const handleTimePickerClick = () => {
    if (isMobile) {
      return;
    }
    setIsTimeOptionsVisible(prev => !prev);

    if (hourOptionsRef.current && hourScrollIndex) {
      const itemElement = hourOptionsRef.current.children[hourScrollIndex];
      if (itemElement) {
        itemElement.scrollIntoView();
      }
    }

    if (minuteOptionsRef.current && minuteScrollIndex) {
      const itemElement = minuteOptionsRef.current.children[minuteScrollIndex];
      if (itemElement) {
        itemElement.scrollIntoView();
      }
    }
  };

  const handleRefreshBtnClick = (event: React.MouseEvent) => {
    setHour(DEFAULT_HOUR);
    setMinute(DEFAULT_MINUTE);
    setTime(`${DEFAULT_HOUR}:${DEFAULT_MINUTE}`);
    event.stopPropagation();
  };

  const handleHourOptionsClick = (paddedHour: string) => () => {
    setHour(paddedHour);
    setIsTimeOptionsVisible(false);
    setTime(`${paddedHour}:${minute}`);
  };
  const handleMinuteOptionsClick = (paddedMinute: string) => () => {
    setMinute(paddedMinute);
    setIsTimeOptionsVisible(false);
    setTime(`${hour}:${paddedMinute}`);
  };

  const hourOptions = useMemo(() => {
    return hourDataList.map((hourData, idx) => {
      const paddedHour = `${hourData}`.padStart(2, '0');
      if (paddedHour === hour) {
        setHourScrollIndex(idx);
      }
      return (
        <TimeOptionsItem
          key={idx}
          onClick={handleHourOptionsClick(paddedHour)}
          isSelected={paddedHour === hour}
        >
          {paddedHour}
        </TimeOptionsItem>
      );
    });
  }, [hour]);
  const minuteOptions = useMemo(() => {
    return minuteDataList.map((minuteData, idx) => {
      const paddedMinute = `${minuteData}`.padStart(2, '0');
      if (paddedMinute === minute) {
        setMinuteScrollIndex(idx);
      }
      return (
        <TimeOptionsItem
          key={idx}
          onClick={handleMinuteOptionsClick(paddedMinute)}
          isSelected={paddedMinute === minute}
        >
          {paddedMinute}
        </TimeOptionsItem>
      );
    });
  }, [minute]);

  return (
    <TimePickerBox>
      <TimePickerContent
        isDesktop={isDesktop}
        onClick={handleTimePickerClick}
        onMouseEnter={handleTimePickerMouseEnter}
        onMouseLeave={handleTimePickerMouseLeave}
      >
        {`${hour} : ${minute}`}
        {isRefreshIconVisible && isDesktop && (
          <RefreshBtn type="button" onClick={handleRefreshBtnClick}>
            <RefreshIcon width={10} height={10} />
          </RefreshBtn>
        )}
      </TimePickerContent>
      {isDesktop && (
        <TimeOptionsDropdown
          isTimeOptionsVisible={isTimeOptionsVisible}
          ref={timeOptionsRef}
        >
          <TimeOptionsListBox>
            <TimeOptionsList
              onMouseEnter={handleHourOptionsMouseEnter}
              onMouseLeave={handleHourOptionsMouseLeave}
              isVisible={isHourOptionsScrollVisible}
              ref={hourOptionsRef}
            >
              {hourOptions}
            </TimeOptionsList>
            <TimeOptionsList
              onMouseEnter={handleMinuteOptionsMouseEnter}
              onMouseLeave={handleMinuteOptionsMouseLeave}
              isVisible={isMinuteOptionsScrollVisible}
              ref={minuteOptionsRef}
            >
              {minuteOptions}
            </TimeOptionsList>
          </TimeOptionsListBox>
        </TimeOptionsDropdown>
      )}
    </TimePickerBox>
  );
};

const TimePickerBox = styled.div`
  position: relative;
`;

const TimePickerContent = styled.div<{ isDesktop: boolean }>`
  position: relative;
  width: 90px;
  height: 20px;
  display: flex;
  justify-content: center;
  background-color: #f6f6f6;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  color: #4f4f4f;
  font-size: 1.2rem;
  line-height: 20px;
  transition: border-color 0.2s;
  ${({ isDesktop }) => {
    if (isDesktop) {
      return css`
        cursor: pointer;
        &:hover {
          border-color: #4096ff;
        }
      `;
    }
  }}
`;

const RefreshBtn = styled.button`
  position: absolute;
  right: 5px;
  line-height: 20px;
  &:hover svg {
    fill: #4096ff;
  }
`;

const TimeOptionsDropdown = styled.div<{ isTimeOptionsVisible: boolean }>`
  max-height: ${({ isTimeOptionsVisible }) =>
    isTimeOptionsVisible ? '180px' : '0px'};
  overflow: hidden;
  transition: max-height 0.1s ease-out;
  position: absolute;
  top: 22px;
  left: 0;
  width: 90px;
  height: 180px;
  background-color: #fff;
  border-radius: 5px;
  color: #4f4f4f;
  box-shadow: ${({ isTimeOptionsVisible }) =>
    isTimeOptionsVisible
      ? `0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)`
      : 'null'};
  z-index: ${TIMEPICKER_Z_INDEX};
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
  isSelected: boolean;
}>`
  font-size: 1.2rem;
  padding: 4px 10px;
  border-radius: 5px;
  background-color: ${({ isSelected }) => (isSelected ? '#e6f4ff' : 'none')};
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  cursor: pointer;
`;

export default TimePicker;
