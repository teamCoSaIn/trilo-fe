import { useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as PlusIcon } from '@/assets/plus.svg';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import NewPlanCard from '@/components/PlanCardList/NewPlanCard';
import color from '@/constants/color';

const PlanCardAddBtn = () => {
  const [onCreation, setOnCreation] = useState(false);

  const handleAddBtnClick = () => {
    setOnCreation(true);
  };

  const handleClose = () => {
    setOnCreation(false);
  };

  return (
    <>
      <Flex column>
        <AddBtn onClick={handleAddBtnClick}>
          <PlusIcon />
        </AddBtn>
        <Spacing height={16} />
        <Box>
          <Description color={color.gray3} fontSize={2}>
            일정 새로 만들기
          </Description>
        </Box>
      </Flex>
      {onCreation && <NewPlanCard handleClose={handleClose} />}
    </>
  );
};

const AddBtn = styled.button`
  width: 230px;
  height: 230px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #96afff;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  padding: 3px 15px;
`;

export default PlanCardAddBtn;
