import styled from 'styled-components';

import ScheduleTab from '@/components/ScheduleTab';
import color from '@/constants/color';
import { HEADER_HEIGHT } from '@/constants/size';

const PlanRightWindow = () => {
  return (
    <PlanRightWindowBox>
      <ScheduleTab />
    </PlanRightWindowBox>
  );
};

const PlanRightWindowBox = styled.div`
  position: fixed;
  right: 0;
  top: ${HEADER_HEIGHT};
  width: 400px;
  height: calc(100% - ${HEADER_HEIGHT});
  background-color: ${color.white};
  padding: 12px 17px;
`;

export default PlanRightWindow;
