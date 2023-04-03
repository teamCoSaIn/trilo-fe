import { ClickAwayListener } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState, SyntheticEvent, useRef } from 'react';
import styled from 'styled-components';

import HTTP from '@/api/index';
import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import { ReactComponent as LogoIcon } from '@/assets/logo.svg';
import Flex from '@/components/common/Flex/index';
import CircularLoader from '@/components/common/Loader/index';
import Spacing from '@/components/common/Spacing/index';

interface NewTripCardProps {
  handleClose: () => void;
}

const NewTripCard = ({ handleClose }: NewTripCardProps) => {
  const [titleInputValue, setTitleInputValue] = useState('');
  const newTripCardRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (tripCardTitle: string) => HTTP.createTripCard(tripCardTitle),
    {
      onSuccess: () => {
        handleClose();
        queryClient.invalidateQueries(['tripList']);
      },
    }
  );

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(titleInputValue);
    handleClose();
  };

  const handleTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitleInputValue(event.target.value);
  };

  const handleTitleFormClickAway = (event: Event | SyntheticEvent) => {
    if (
      newTripCardRef.current &&
      newTripCardRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    handleClose();
  };

  return isLoading ? (
    <LoadingBox column>
      <CircularLoader />
    </LoadingBox>
  ) : (
    <ClickAwayListener onClickAway={handleTitleFormClickAway}>
      <Flex column ref={newTripCardRef}>
        <TripContent>
          <LogoIcon fill="white" />
        </TripContent>
        <Spacing height={16} />
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
      </Flex>
    </ClickAwayListener>
  );
};

const TripContent = styled.div`
  width: 230px;
  height: 230px;
  background-color: #4d77ff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #eaefff;
  border-radius: 18px;
  height: 36px;
  padding: 3px 15px;
  width: 230px;
  box-sizing: border-box;
`;

const TitleEditInput = styled.input`
  font-size: 2rem;
  color: #b8b8b8;
  width: 100%;
`;

const TitleConfirmBtn = styled.button`
  display: flex;
  align-items: center;
`;

const LoadingBox = styled(Flex)`
  width: 230px;
`;

export default NewTripCard;
