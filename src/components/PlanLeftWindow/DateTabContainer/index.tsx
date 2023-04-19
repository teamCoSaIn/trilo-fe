import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { ReactComponent as DownArrow } from '@/assets/downArrow.svg';
import { ReactComponent as Refresh } from '@/assets/refresh.svg';
import { ReactComponent as UpArrow } from '@/assets/upArrow.svg';
import Button from '@/components/common/Button';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
import Line from '@/components/common/Line';
import Spacing from '@/components/common/Spacing';
import Calendar from '@/components/PlanLeftWindow/Calendar';
import color from '@/constants/color';
import useGetDayList from '@/queryHooks/useGetDayList';
import SelectedDates from '@/states/calendar';
import { transformDateToDotFormat } from '@/utils/calendar';

const DateTabContainer = () => {
  const { id } = useParams();
  const { data } = useGetDayList({
    planId: id as string,
  });
  // TODO: planDay 객체 date 형식 변경 필요
  const firstDate = data![0].date !== 'none' ? new Date(2023, 3, 22) : null;
  const [curDateObj, setCurDateObj] = useState(firstDate || new Date());
  const [curYear, curMonth] = [curDateObj.getFullYear(), curDateObj.getMonth()];
  const [[selectedStartDate, selectedEndDate], setSelectedDates] =
    useRecoilState(SelectedDates);

  const handleClickRefreshBtn = () => {
    setSelectedDates([null, null]);
  };
  const handleClickPrevMonthBtn = () => {
    setCurDateObj(new Date(curYear, curMonth - 1));
  };

  const handleClickNextMonthBtn = () => {
    setCurDateObj(new Date(curYear, curMonth + 1));
  };

  const startDateString = selectedStartDate
    ? transformDateToDotFormat(selectedStartDate)
    : '';
  const endDateString = selectedEndDate
    ? transformDateToDotFormat(selectedEndDate)
    : '';

  return (
    <Flex column alignCenter justifyCenter>
      <Spacing height={42} />
      <Calendar date={curDateObj} />
      <Spacing height={10} />
      <Line width={231} />
      <Spacing height={10} />
      <Calendar date={new Date(curYear, curMonth + 1)} />
      <Spacing height={20} />
      <BtnWrapper>
        <CalendarBtn onClick={handleClickRefreshBtn}>
          <Refresh />
        </CalendarBtn>
        <Flex justifyCenter alignCenter>
          <CalendarBtn onClick={handleClickPrevMonthBtn}>
            <UpArrow />
          </CalendarBtn>
          <Spacing width={4} />
          <CalendarBtn onClick={handleClickNextMonthBtn}>
            <DownArrow />
          </CalendarBtn>
        </Flex>
      </BtnWrapper>
      <Spacing height={57} />
      <Flex alignCenter>
        <Description fontSize={1.2} color={color.blue3}>
          시작일
        </Description>
        <Line left={26} right={26} width={42} />
        <Description fontSize={1.2} color={color.blue3}>
          종료일
        </Description>
      </Flex>
      <Spacing height={12} />
      <Flex>
        <DateDescription>{startDateString}</DateDescription>
        <Spacing width={27} />
        <DateDescription>{endDateString}</DateDescription>
      </Flex>
      <Spacing height={36} />
      <Button
        type="button"
        btnSize="medium"
        disabled={!selectedStartDate || !selectedEndDate}
      >
        확인
      </Button>
    </Flex>
  );
};

const BtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 210px;
`;

const CalendarBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 27px;
  height: 27px;
  border: 0.5px solid ${color.gray2};
  border-radius: 7px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
`;

const DateDescription = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 102px;
  height: 33px;
  font-size: 1.4rem;
  font-weight: 700;
  background-color: #d9d9d9;
  border-radius: 16px;
`;

export default DateTabContainer;
