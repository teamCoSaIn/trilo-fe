import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import useGetDayList from '@/queryHooks/useGetDayList';
import { InfoBoxVisible } from '@/states/googleMaps';

const DateSelector = () => {
  const { id } = useParams();

  const { data: tripDaysData } = useGetDayList({
    tripId: id as string,
  });

  const infoBoxRef = useRef<HTMLDivElement>(null);

  const [isDateSelectorVisible, setIsDateSelectorVisible] =
    useRecoilState(InfoBoxVisible);

  const handleClickAway = useCallback((event: MouseEvent) => {
    if (isDateSelectorVisible && event.target !== infoBoxRef.current) {
      setIsDateSelectorVisible(false);
    }
  }, []);

  useEffect(() => {
    if (isDateSelectorVisible) {
      document.addEventListener('click', handleClickAway);
    }
    return () => {
      document.removeEventListener('click', handleClickAway);
    };
  }, []);

  const handleClickInfoBox = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleWheelInfoBox = (event: React.WheelEvent) => {
    event.stopPropagation();
  };

  const handleMouseDownInfoBox = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const dateSelectorDateList = tripDaysData
    ?.filter(tripDayData => tripDayData.date)
    .map((tripDayData, idx) => {
      const date = tripDayData.date?.split('-').join('.').substring(2);
      return (
        <DateSelectorDateItem key={tripDayData.dayId}>
          <DateSelectorDateBtn>{`Day ${
            idx + 1
          } - ${date}`}</DateSelectorDateBtn>
        </DateSelectorDateItem>
      );
    });

  return (
    <DateSelectorBox
      onClick={handleClickInfoBox}
      onWheel={handleWheelInfoBox}
      onMouseDown={handleMouseDownInfoBox}
      ref={infoBoxRef}
    >
      <DateSelctorHeader>일정 추가하기</DateSelctorHeader>
      <DateSelectorDateListBox>{dateSelectorDateList}</DateSelectorDateListBox>
      <DateSelectorTempStorageBox>
        <DateSelectorDateBtn>임시 보관함</DateSelectorDateBtn>
      </DateSelectorTempStorageBox>
    </DateSelectorBox>
  );
};

const DateSelectorBox = styled.div`
  width: 140px;
  background-color: #f6f6f6;
  border-radius: 5px;
`;

const DateSelctorHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  padding: 8px 30px;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  background-color: #456ceb;
  border-radius: 5px 5px 0 0;
`;

const DateSelectorDateListBox = styled.ul`
  padding: 5px 5px 5px 11px;
  max-height: 126px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 20px;
  }
`;

const DateSelectorDateItem = styled.li`
  width: 118px;
  height: 25px;
  text-align: center;
  font-weight: 400;
  font-size: 12px;
  font-family: 'Noto Sans KR';
  color: #4f4f4f;
  &:hover {
    background: #ecf0ff;
    border-radius: 11.5px;
  }
`;

const DateSelectorDateBtn = styled.button`
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  color: inherit;
  width: 100%;
  height: 100%;
`;

const DateSelectorTempStorageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  font-size: 12px;
  font-weight: 500;
  color: #4d77ff;
  background-color: #ecf0ff;
  border-radius: 0px 0px 5px 5px;
`;

export default DateSelector;
