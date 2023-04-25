import { ClickAwayListener } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState, SyntheticEvent, useRef } from 'react';
import styled from 'styled-components';

import HTTP from '@/api';
import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import { ReactComponent as LogoIcon } from '@/assets/logo.svg';
import DimLoader from '@/components/common/DimLoader';
import Flex from '@/components/common/Flex';

interface NewPlanCardProps {
  handleClose: () => void;
}

const NewPlanCard = ({ handleClose }: NewPlanCardProps) => {
  const [titleInputValue, setTitleInputValue] = useState('');
  const newPlanCardRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (planCardTitle: string) => HTTP.createPlanCard(planCardTitle),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['planCardList']);
      },
    }
  );

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(titleInputValue);
  };

  const handleTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitleInputValue(event.target.value);
  };

  const handleTitleFormClickAway = (event: Event | SyntheticEvent) => {
    if (
      newPlanCardRef.current &&
      newPlanCardRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    handleClose();
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleTitleFormClickAway}>
        <PlanCardBox column ref={newPlanCardRef}>
          {isLoading && <DimLoader />}
          <LogoBox>
            <LogoIcon fill="white" />
          </LogoBox>
          <BottomBox>
            <TitleForm onSubmit={handleTitleSubmit}>
              <TitleEditInput
                type="text"
                value={titleInputValue}
                placeholder="계획명을 입력해주세요."
                onChange={handleTitleInputChange}
                autoFocus
                maxLength={20}
              />
              <TitleConfirmBtn type="submit">
                <CheckIcon fill="#4D77FF" width={14} height={14} />
              </TitleConfirmBtn>
            </TitleForm>
          </BottomBox>
        </PlanCardBox>
      </ClickAwayListener>
    </>
  );
};

const PlanCardBox = styled(Flex)`
  width: 245px;
  height: 256px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2.97356px 20px rgba(0, 0, 0, 0.1);
`;

const LogoBox = styled.div`
  width: 100%;
  height: 176px;
  background-color: #4d77ff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomBox = styled(Flex)`
  width: 100%;
  height: 80px;
  padding: 14px 12px;
`;

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

const TitleConfirmBtn = styled.button`
  display: flex;
  align-items: center;
`;

export default NewPlanCard;
