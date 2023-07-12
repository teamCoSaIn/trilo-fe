import { ClickAwayListener } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState, SyntheticEvent, useRef } from 'react';
import { toast } from 'react-toastify';
import styled, { css } from 'styled-components';

import HTTP from '@/api';
import { TCreateTripParams } from '@/api/trip';
import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import { ReactComponent as LogoIcon } from '@/assets/logo.svg';
import DimLoader from '@/components/common/DimLoader';
import Flex from '@/components/common/Flex';
import color from '@/constants/color';
import {
  NEW_TRIP_CARD_Z_INDEX,
  TRIP_LIST_DIM_LAYER_Z_INDEX,
} from '@/constants/zIndex';
import { tripTitleRegExp } from '@/utils/regExp';

interface INewTripCardProps {
  handleClose: () => void;
}

const NewTripCard = ({ handleClose }: INewTripCardProps) => {
  const [titleInputValue, setTitleInputValue] = useState('');
  const [isAwayClicked, setIsAwayClicked] = useState(false);
  const newTripCardRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (tripTitle: TCreateTripParams) => HTTP.createTrip(tripTitle),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tripList']);
        queryClient.invalidateQueries(['userInfo']);
      },
    }
  );

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isInputValid = tripTitleRegExp.test(
      titleInputValue.replace(/\s/g, '')
    );
    if (!isInputValid) {
      toast.error(
        '올바르지 않은 입력입니다. 공백 이외의 문자를 포함하여 20자 이내로 입력해주세요.',
        {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        }
      );
      return;
    }
    mutate(titleInputValue);
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
    setIsAwayClicked(true);
  };

  const handleTripCardAnimationEnd = () => {
    if (isAwayClicked) {
      handleClose();
    }
  };

  return (
    <>
      <DimLayer />
      <ClickAwayListener onClickAway={handleTitleFormClickAway}>
        <TripCardBox
          column
          ref={newTripCardRef}
          isAwayClicked={isAwayClicked}
          onAnimationEnd={handleTripCardAnimationEnd}
        >
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
        </TripCardBox>
      </ClickAwayListener>
    </>
  );
};

const DimLayer = styled.div`
  z-index: ${TRIP_LIST_DIM_LAYER_Z_INDEX};
  background-color: ${color.black};
  opacity: 0.5;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const TripCardBox = styled(Flex)<{ isAwayClicked: boolean }>`
  z-index: ${NEW_TRIP_CARD_Z_INDEX};
  height: 256px;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 28px;
  ${({ isAwayClicked }) => {
    if (isAwayClicked) {
      return css`
        animation: decreaseWidth 0.3s forwards;
        @keyframes decreaseWidth {
          0% {
            width: 245px;
          }
          50% {
            margin-left: 24px;
          }
          90% {
            margin-left: 12px;
          }
          100% {
            width: 0;
            margin-left: 0;
          }
        }
      `;
    }
    return css`
      animation-name: increaseWidth, boxShadowFlicker;
      animation-duration: 0.3s, 2s;
      animation-iteration-count: 1, infinite;
      animation-direction: normal, alternate;
      @keyframes boxShadowFlicker {
        0% {
        }
        100% {
          box-shadow: 0 0 10px white;
        }
      }
      @keyframes increaseWidth {
        0% {
          width: 0;
        }
        100% {
          width: 245px;
        }
      }
    `;
  }};
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
  background-color: ${color.white};
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

export default NewTripCard;
