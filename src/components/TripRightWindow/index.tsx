import styled from 'styled-components';

import ScheduleTab from '@/components/ScheduleTab';
import color from '@/constants/color';

const TripRightWindow = () => {
  return (
    <TripRightWindowBox>
      <ScheduleTab />
    </TripRightWindowBox>
  );
};

const TripRightWindowBox = styled.div`
  width: 400px;
  height: 100%;
  background-color: ${color.white};
  padding: 12px 17px;
  flex-shrink: 0;
`;

export default TripRightWindow;