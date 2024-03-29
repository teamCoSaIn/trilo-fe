import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import { ReactComponent as DownArrow } from '@/assets/downArrow.svg';
import { ReactComponent as Refresh } from '@/assets/refresh.svg';
import { ReactComponent as UpArrow } from '@/assets/upArrow.svg';
import Button from '@/components/common/Button';
import Description from '@/components/common/Description';
import DimLoader from '@/components/common/DimLoader';
import Flex from '@/components/common/Flex';
import Line from '@/components/common/Line';
import Portal from '@/components/common/Portal';
import Spacing from '@/components/common/Spacing';
import Calendar from '@/components/DateTab/Calendar';
import color from '@/constants/color';
import useChangeTripPeriod from '@/queryHooks/useChangeTripPeriod';
import useGetTrip from '@/queryHooks/useGetTrip';
import SelectedDates, { IsPeriodOver10Days } from '@/states/calendar';
import {
  transformDateToApiFormat,
  transformDateToDotFormat,
} from '@/utils/calendar';

// title + spacing + calendar = 19 + 12 + 210
const CALENDAR_HEIGHT = 241;
// calendar + spacing + line + spacing= 241 + 30
const SLIDING_DISTANCE = CALENDAR_HEIGHT + 30;
// calendar + spacing + line + spacing + calendar = 241 + 30 + 241
const TRANSITION_WINDOW_HEIGHT = CALENDAR_HEIGHT * 2 + 30;
type TSlidingStatus = 'STOP' | 'UP' | 'DOWN';

const DateTab = () => {
  const { tripId } = useParams();

  const { mutate, isLoading: isChangeTripPeriodLoading } =
    useChangeTripPeriod();

  const { data: tripData } = useGetTrip({
    tripId: +(tripId as string),
  });

  const [selectedStartDate, selectedEndDate] = useRecoilValue(SelectedDates);
  const resetSelectedDates = useResetRecoilState(SelectedDates);
  const isPeriodOver10Days = useRecoilValue(IsPeriodOver10Days);

  const [curDateObj, setCurDateObj] = useState(
    tripData?.startDate ? new Date(tripData.startDate) : new Date()
  );
  const [curYear, curMonth] = [curDateObj.getFullYear(), curDateObj.getMonth()];
  const [slidingStatus, setSlidingStatus] = useState<TSlidingStatus>('STOP');

  const handleRefreshBtnClick = () => {
    resetSelectedDates();
  };
  const handlePrevMonthBtnClick = () => {
    if (slidingStatus !== 'STOP') return;
    setSlidingStatus('DOWN');
  };

  const handleNextMonthBtnClick = () => {
    if (slidingStatus !== 'STOP') return;
    setSlidingStatus('UP');
  };

  const handleSlidingPartTransitionEnd = () => {
    if (slidingStatus === 'UP') {
      setCurDateObj(new Date(curYear, curMonth + 1));
    }
    if (slidingStatus === 'DOWN') {
      setCurDateObj(new Date(curYear, curMonth - 1));
    }
    setSlidingStatus('STOP');
  };

  const startDateString = selectedStartDate
    ? transformDateToDotFormat(selectedStartDate)
    : '';
  const endDateString = selectedEndDate
    ? transformDateToDotFormat(selectedEndDate)
    : '';

  const handleChangePeriodBtnClick = () => {
    if (!tripId || !selectedStartDate || !selectedEndDate) {
      return;
    }
    mutate({
      tripId: +tripId,
      startDate: transformDateToApiFormat(selectedStartDate),
      endDate: transformDateToApiFormat(selectedEndDate),
    });
  };

  const isPeriodSame =
    tripData?.startDate?.replace(/-/g, '.') === startDateString &&
    tripData?.endDate?.replace(/-/g, '.') === endDateString;

  return (
    <DateTabBox column alignCenter justifyCenter>
      <Spacing height={30} />
      <SlidingWindow>
        <Slider
          slidingStatus={slidingStatus}
          onTransitionEnd={handleSlidingPartTransitionEnd}
        >
          <Calendar date={new Date(curYear, curMonth - 1)} />
          <Spacing height={10} />
          <Line width={210} />
          <Spacing height={20} />
          <Calendar date={curDateObj} />
          <Spacing height={10} />
          <Line width={210} />
          <Spacing height={20} />
          <Calendar date={new Date(curYear, curMonth + 1)} />
          <Spacing height={10} />
          <Line width={210} />
          <Spacing height={20} />
          <Calendar date={new Date(curYear, curMonth + 2)} />
        </Slider>
      </SlidingWindow>
      <Spacing height={20} />
      <BtnWrapper>
        <CalendarBtn onClick={handleRefreshBtnClick}>
          <Refresh />
        </CalendarBtn>
        <Flex justifyCenter alignCenter>
          <CalendarBtn onClick={handlePrevMonthBtnClick}>
            <UpArrow />
          </CalendarBtn>
          <Spacing width={4} />
          <CalendarBtn onClick={handleNextMonthBtnClick}>
            <DownArrow />
          </CalendarBtn>
        </Flex>
      </BtnWrapper>
      <Spacing height={10} />
      <AlertMessageBox>
        {isPeriodOver10Days && (
          <AlertMessage fontSize={1.3} color="red">
            최대 10일까지 선택할 수 있습니다.
          </AlertMessage>
        )}
      </AlertMessageBox>
      <Spacing height={10} />
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
        disabled={
          !selectedStartDate ||
          !selectedEndDate ||
          isPeriodOver10Days ||
          isPeriodSame
        }
        onClick={handleChangePeriodBtnClick}
      >
        확인
      </Button>
      {isChangeTripPeriodLoading && <Portal childComponent={<DimLoader />} />}
      <Spacing height={40} />
    </DateTabBox>
  );
};

const DateTabBox = styled(Flex)`
  min-width: 364px;
`;

const SlidingWindow = styled.div`
  height: ${TRANSITION_WINDOW_HEIGHT}px;
  overflow-y: hidden;
`;

const Slider = styled.div<{ slidingStatus: TSlidingStatus }>`
  ${({ slidingStatus }) => {
    switch (slidingStatus) {
      case 'UP':
        return css`
          transform: translateY(-${SLIDING_DISTANCE * 2}px);
          transition: all ease-out 0.3s;
        `;
      case 'DOWN':
        return css`
          transform: translateY(0);
          transition: all ease-out 0.3s;
        `;
      default:
        return css`
          transform: translateY(-${SLIDING_DISTANCE}px);
        `;
    }
  }}
`;

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

const AlertMessageBox = styled.div`
  min-height: 30px;
`;

const AlertMessage = styled(Description)`
  display: flex;
  align-items: center;
  min-height: 30px;
  animation: vibrate 0.15s 4;
  @keyframes vibrate {
    0% {
      transform: translateX(0px);
    }
    25% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }
`;

export default DateTab;
