import { useState } from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as PlusIcon } from '@/assets/plus.svg';
import Flex from '@/components/common/Flex';
import NewTripCard from '@/components/TripCardList/NewTripCard';
import color from '@/constants/color';
import useMedia from '@/hooks/useMedia';

const TripCardAddBtn = () => {
  const { isMobile } = useMedia();

  const [onCreation, setOnCreation] = useState(false);

  const handleAddBtnClick = () => {
    setOnCreation(true);
  };

  const handleClose = () => {
    setOnCreation(false);
  };

  return (
    <Flex column={isMobile}>
      <AddBtn onClick={handleAddBtnClick} isMobile={isMobile}>
        <PlusIcon width={isMobile ? 20 : 46} height={isMobile ? 20 : 46} />
        {isMobile && '새로운 계획을 만들어보세요'}
      </AddBtn>
      {onCreation && <NewTripCard handleClose={handleClose} />}
    </Flex>
  );
};

const AddBtn = styled.button<{ isMobile: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: ${color.blue3};
  border-radius: 10px;
  background-color: ${color.blue1};
  &:hover {
    background-color: ${color.blue2};
  }
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        width: 100%;
        height: 70px;
      `;
    }
    return css`
      width: 245px;
      height: 256px;
    `;
  }}
`;

export default TripCardAddBtn;
