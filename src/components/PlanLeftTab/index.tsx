import { useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as LeftArrowIcon } from '@/assets/LeftArrow.svg';
import { ReactComponent as RightArrowIcon } from '@/assets/RightArrow.svg';
import { HEADER_HEIGHT } from '@/constants/size';

const PlanLeftTab = () => {
  const [isTabFold, setIsTabFold] = useState(false);

  return (
    <PlanLeftTabBox isTabFold={isTabFold}>
      <TabFoldBtn
        onClick={() => {
          setIsTabFold(prev => !prev);
        }}
      >
        {isTabFold ? <RightArrowIcon /> : <LeftArrowIcon />}
      </TabFoldBtn>
    </PlanLeftTabBox>
  );
};

const PlanLeftTabBox = styled.div<{ isTabFold: boolean }>`
  position: fixed;
  top: ${HEADER_HEIGHT};
  left: 0px;
  width: 363px;
  height: calc(100% - ${HEADER_HEIGHT});
  background-color: #ddd;
  ${props => (props.isTabFold ? 'transform: translate(-363px);' : null)}
  transition: all .5s;
`;

const TabFoldBtn = styled.button`
  position: absolute;
  right: -30px;
  top: calc(50% - 30px);
  width: 30px;
  height: 60px;
  background-color: #aaa;
`;

export default PlanLeftTab;
