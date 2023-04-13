import styled from 'styled-components';

import { HEADER_HEIGHT } from '@/constants/size';

const PlanRightTab = () => {
  return <PlanRightTabBox>오른쪽</PlanRightTabBox>;
};

const PlanRightTabBox = styled.div`
  position: fixed;
  right: 0px;
  top: ${HEADER_HEIGHT};
  width: 400px;
  height: 100%;
  background-color: #ddd;
`;

export default PlanRightTab;
