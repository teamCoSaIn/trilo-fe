import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import ScheduleDropdown from '@/components/ScheduleDropdown';
import ScheduleList from '@/components/ScheduleList';
import color from '@/constants/color';

const TripRightWindow = () => {
  const { tripId } = useParams();

  return (
    <TripRightWindowBox>
      <ScheduleDropdown tripId={tripId as string} />
      <ScheduleContent>
        <ScheduleList />
      </ScheduleContent>
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

const ScheduleContent = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 23px);
  width: 100%;
  margin-top: 23px;
  border: 1px solid #d9d9d9;
  background-color: #f6f6f6;
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;

export default TripRightWindow;
