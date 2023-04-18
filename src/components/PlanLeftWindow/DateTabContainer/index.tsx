import styled from 'styled-components';

import Button from '@/components/common/Button';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
import Line from '@/components/common/Line';
import Spacing from '@/components/common/Spacing';
import Calendar from '@/components/PlanLeftWindow/Calendar';
import color from '@/constants/color';

const DateTabContainer = () => {
  return (
    <Flex column alignCenter>
      <Spacing height={42} />
      <Calendar date={new Date()} />
      <Line width={231} />
      <Calendar date={new Date()} />
      <Spacing height={20} />
      <Flex>
        <CalendarBtn>새</CalendarBtn>
        <CalendarBtn>위</CalendarBtn>
        <CalendarBtn>아</CalendarBtn>
      </Flex>
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
        <DateDescription alignCenter justifyCenter />
        <Spacing width={27} />
        <DateDescription alignCenter justifyCenter />
      </Flex>
      <Spacing height={54} />
      <Button type="button" btnSize="medium" disabled>
        확인
      </Button>
    </Flex>
  );
};

const CalendarBtn = styled.button`
  width: 27px;
  height: 27px;
  border: 0.5px solid ${color.gray2};
  border-radius: 7px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
`;

const DateDescription = styled(Flex)`
  width: 102px;
  height: 33px;
  background-color: #d9d9d9;
  border-radius: 16px;
`;

export default DateTabContainer;
