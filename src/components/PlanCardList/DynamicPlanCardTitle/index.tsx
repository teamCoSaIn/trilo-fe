import { ClickAwayListener } from '@mui/material';
import React, { SyntheticEvent, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import Description from '@/components/common/Description';
import color from '@/constants/color';
import useChangePlanCardTitle from '@/queryHooks/useChangePlanCardTitle';
import IsTitleEditFamily from '@/states/planCard';

interface PlanCardTitleProps {
  planCardTitle: string;
  planCardId: number;
}

const DynamicPlanCardTitle = ({
  planCardId,
  planCardTitle,
}: PlanCardTitleProps) => {
  const [isTitleEdit, setIsTitleEdit] = useRecoilState(
    IsTitleEditFamily(planCardId)
  );
  const [titleInputValue, setTitleInputValue] = useState('');

  const titleFormRef = useRef<HTMLFormElement>(null);

  const { mutate } = useChangePlanCardTitle();

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (planCardTitle !== titleInputValue) {
      mutate({ title: titleInputValue, id: planCardId });
    }
    setTitleInputValue('');
    setIsTitleEdit(false);
  };

  const handleTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitleInputValue(event.target.value);
  };

  const handleTitleFormClickAway = (event: Event | SyntheticEvent) => {
    if (
      titleFormRef.current &&
      titleFormRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setIsTitleEdit(false);
    setTitleInputValue('');
  };

  const DynamicTitle = isTitleEdit ? (
    <ClickAwayListener onClickAway={handleTitleFormClickAway}>
      <TitleForm onSubmit={handleTitleSubmit} ref={titleFormRef}>
        <TitleEditInput
          type="text"
          value={titleInputValue}
          placeholder={planCardTitle}
          onChange={handleTitleInputChange}
          autoFocus
          maxLength={20}
        />
        <TitleConfirmBtn type="submit">
          <CheckIcon fill="#4D77FF" width={14} height={14} />
        </TitleConfirmBtn>
      </TitleForm>
    </ClickAwayListener>
  ) : (
    <Box>
      <Description color={color.gray3} fontSize={1.6}>
        {planCardTitle}
      </Description>
    </Box>
  );

  return DynamicTitle;
};

const TitleForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #eaefff;
  height: 28px;
  width: 220px;
  padding: 2px 8px;
  box-sizing: border-box;
`;

const TitleEditInput = styled.input`
  font-size: 1.6rem;
  color: #b8b8b8;
  width: 100%;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  height: 28px;
  width: 220px;
  padding: 2px 8px;
`;

const TitleConfirmBtn = styled.button`
  display: flex;
  align-items: center;
`;

export default DynamicPlanCardTitle;
