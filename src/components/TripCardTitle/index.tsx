import React, { useState } from 'react';
import styled from 'styled-components';

import { TripCardData } from '@/api/tripList';
import Description from '@/components/common/Description';
import color from '@/constants/color';

interface TripCardTitleProps {
  cardData: TripCardData;
}

const TripCardTitle = ({ cardData }: TripCardTitleProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [titleInputValue, setTitleInputValue] = useState(cardData.title);

  const handleChangeTitleInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitleInputValue(event.target.value);
  };

  const title = isEdit ? (
    <TitleForm>
      <TitleEditInput
        type="text"
        value={titleInputValue}
        onChange={handleChangeTitleInput}
        autoFocus
        maxLength={20}
      />
    </TitleForm>
  ) : (
    <Box onClick={() => setIsEdit(true)}>
      <Description color={color.gray3} fontSize={2}>
        {cardData.title}
      </Description>
    </Box>
  );
  return title;
};

const TitleForm = styled.form`
  display: flex;
  align-items: center;
  background-color: #eaefff;
  border-radius: 18px;
  height: 36px;
  padding: 3px 15px;
  box-sizing: border-box;
`;

const TitleEditInput = styled.input`
  font-size: 2rem;
  color: #b8b8b8;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  padding: 3px 15px;
`;
export default TripCardTitle;
