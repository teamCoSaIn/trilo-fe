import { useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as PlusIcon } from '@/assets/plus.svg';
import NewTripCard from '@/components/TripCardList/NewTripCard';
import color from '@/constants/color';

const TripCardAddBtn = () => {
  const [onCreation, setOnCreation] = useState(false);

  const handleAddBtnClick = () => {
    setOnCreation(true);
  };

  const handleClose = () => {
    setOnCreation(false);
  };

  return (
    <>
      <AddBtn onClick={handleAddBtnClick}>
        <PlusIcon width={46} height={46} />
      </AddBtn>
      {onCreation && <NewTripCard handleClose={handleClose} />}
    </>
  );
};

const AddBtn = styled.button`
  width: 245px;
  height: 256px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${color.blue1};
  &:hover {
    background-color: ${color.blue2};
  }
`;

export default TripCardAddBtn;
