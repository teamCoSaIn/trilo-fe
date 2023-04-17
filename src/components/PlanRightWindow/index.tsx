import styled from 'styled-components';

import { HEADER_HEIGHT } from '@/constants/size';

const PlanRightWindow = () => {
  return <PlanRightWindowBox>오른쪽</PlanRightWindowBox>;
};

const PlanRightWindowBox = styled.div`
  position: fixed;
  right: 0px;
  top: ${HEADER_HEIGHT};
  width: 400px;
  height: 100%;
  background-color: #ddd;
`;

export default PlanRightWindow;
