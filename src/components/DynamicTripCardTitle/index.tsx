import { ClickAwayListener } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { SyntheticEvent, useRef, useState } from 'react';
import styled from 'styled-components';

import HTTP from '@/api/index';
import { TripCardData, TripCardTitleType } from '@/api/tripList';
import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import Description from '@/components/common/Description';
import color from '@/constants/color';

interface TripCardTitleProps {
  cardData: TripCardData;
}

const DynamicTripCardTitle = ({ cardData }: TripCardTitleProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [titleInputValue, setTitleInputValue] = useState('');
  const queryClient = useQueryClient();
  const titleFormRef = useRef<HTMLFormElement>(null);

  const { mutate } = useMutation(
    (titleData: TripCardTitleType) => HTTP.changeTripCardTitle(titleData),
    {
      onMutate: async (titleData: TripCardTitleType) => {
        await queryClient.cancelQueries(['tripList']);

        const previousTripList = queryClient.getQueryData<TripCardData[]>([
          'tripList',
        ]);

        if (previousTripList) {
          queryClient.setQueryData<TripCardData[]>(
            ['tripList'],
            prevTripList => {
              return prevTripList?.map((tripCard: TripCardData) => {
                if (tripCard.id === titleData.id) {
                  return { ...tripCard, title: titleData.title };
                }
                return tripCard;
              });
            }
          );
        }

        return { previousTripList };
      },
      onError: (context?: { previousTripList: TripCardData[] | undefined }) => {
        if (context?.previousTripList) {
          queryClient.setQueryData<TripCardData[]>(
            ['tripList'],
            context.previousTripList
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(['tripList']);
      },
    }
  );

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cardData.title !== titleInputValue) {
      mutate({ title: titleInputValue, id: cardData.id });
    }
    setTitleInputValue('');
    setIsEdit(false);
  };

  const handleTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitleInputValue(event.target.value);
  };

  const handleTitleClick = () => {
    setIsEdit(true);
  };

  const handleTitleFormClickAway = (event: Event | SyntheticEvent) => {
    if (
      titleFormRef.current &&
      titleFormRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setIsEdit(false);
    setTitleInputValue('');
  };

  const DynamicTitle = isEdit ? (
    <ClickAwayListener onClickAway={handleTitleFormClickAway}>
      <TitleForm onSubmit={handleTitleSubmit} ref={titleFormRef}>
        <TitleEditInput
          type="text"
          value={titleInputValue}
          placeholder={cardData.title}
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
    <Box onClick={handleTitleClick}>
      <Description color={color.gray3} fontSize={2}>
        {cardData.title}
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

const Box = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  padding: 3px 15px;
`;

const TitleConfirmBtn = styled.button`
  display: flex;
  align-items: center;
`;

export default DynamicTripCardTitle;
