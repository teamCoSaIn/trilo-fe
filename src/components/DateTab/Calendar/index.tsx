import styled, { css } from 'styled-components';

import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import DateContainer from '@/components/DateTab/DateContainer';
import { getDateInfoArray } from '@/utils/calendar';

interface ICalendarProps {
  date: Date;
}

const Calendar = ({ date }: ICalendarProps) => {
  const calendarYear = date.getFullYear();
  const calendarMonth = date.getMonth() + 1;
  const curDateObj = new Date();
  const curYear = curDateObj.getFullYear();
  const curMonth = curDateObj.getMonth() + 1;
  const curDate = curDateObj.getDate();

  const title = `${calendarYear}.${
    calendarMonth < 10 ? '0' : ''
  }${calendarMonth}`;
  const days = ['일', '월', '화', '수', '목', '금', '토'].map(day => {
    if (day === '일') {
      return (
        <Day key={day} color="red">
          {day}
        </Day>
      );
    }
    return <Day key={day}>{day}</Day>;
  });
  const dateInfoArray = getDateInfoArray(date);
  const dates = dateInfoArray.map((week, weekIdx) => {
    const weekDates = week.map((dateInfo, dayIndex) => {
      const isCalendarMonth = dateInfo.month === calendarMonth;
      const isPast =
        curYear > dateInfo.year ||
        (curYear === dateInfo.year && curMonth > dateInfo.month) ||
        (curYear === dateInfo.year &&
          curMonth === dateInfo.month &&
          dateInfo.date < curDate);
      const disabled = !isCalendarMonth || isPast;
      return (
        <DateContainer
          key={`${dateInfo.month}-${dateInfo.date}`}
          dateInfo={dateInfo}
          dayIndex={dayIndex}
          disabled={disabled}
        />
      );
    });
    return <Row key={weekIdx}>{weekDates}</Row>;
  });

  return (
    <Flex column>
      <Title>{title}</Title>
      <Spacing height={12} />
      <Table>
        <thead>
          <Row>{days}</Row>
        </thead>
        <TableBody>{dates}</TableBody>
      </Table>
    </Flex>
  );
};

const Title = styled.h2`
  font-weight: 700;
  font-size: 1.9rem;
`;

const Table = styled.table`
  cursor: default;
`;

const TableBody = styled.tbody`
  display: flex;
  flex-direction: column;
  min-height: 180px;
`;

const Row = styled.tr`
  display: flex;
`;

const Day = styled.th<{ color?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  ${props => css`
    ${props.color && { color: props.color }}
  `};
`;

export default Calendar;
