import { ClickAwayListener } from '@mui/material';
import React, { SyntheticEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import { ITrip } from '@/api/trip';
import Flex from '@/components/common/Flex';
import TripCardBottom from '@/components/TripCardList/TripCardBottom';
import TripCardContent from '@/components/TripCardList/TripCardContent';
import color from '@/constants/color';
import {
  OPTION_OPEN_TRIP_CARD_Z_INDEX,
  TRIP_LIST_DIM_LAYER_Z_INDEX,
} from '@/constants/zIndex';
import useMedia from '@/hooks/useMedia';
import {
  PreviewImgFamily,
  IsOptionOpenFamily,
  IsTitleEditFamily,
} from '@/states/trip';

interface ITripCardProps {
  trip: ITrip;
}

const TripCard = ({ trip }: ITripCardProps) => {
  const { isMobile } = useMedia();

  const navigate = useNavigate();

  const tripCardRef = useRef<HTMLDivElement>(null);

  const [isOptionOpen, setIsOptionOpen] = useRecoilState(
    IsOptionOpenFamily(trip.tripId)
  );
  const [isTitleEdit, setIsTitleEdit] = useRecoilState(
    IsTitleEditFamily(trip.tripId)
  );
  const resetPreviewImg = useResetRecoilState(PreviewImgFamily(trip.tripId));

  useEffect(() => {
    return () => {
      resetPreviewImg();
      setIsTitleEdit(false);
      setIsOptionOpen(false);
    };
  }, []);

  const handleTitleFormClickAway = (event: Event | SyntheticEvent) => {
    if (
      tripCardRef.current &&
      tripCardRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    resetPreviewImg();
    setIsTitleEdit(false);
    setIsOptionOpen(false);
  };

  const handleTripCardClick = () => {
    if (isMobile && !isTitleEdit && !isOptionOpen) {
      navigate(`/triplist/${trip.tripId}`);
    }
  };

  return (
    <>
      {(isOptionOpen || isTitleEdit) && <DimLayer />}
      <ClickAwayListener onClickAway={handleTitleFormClickAway}>
        <TripCardBox
          column={!isMobile}
          isMobile={isMobile}
          alignCenter
          ref={tripCardRef}
          isSelected={isOptionOpen || isTitleEdit}
          onClick={handleTripCardClick}
        >
          <TripCardContent trip={trip} />
          <TripCardBottom trip={trip} />
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

const TripCardBox = styled(Flex)<{ isSelected: boolean; isMobile: boolean }>`
  background-color: ${color.white};
  border: 1px solid ${color.white};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 20px rgba(0, 0, 0, 0.1);
  ${({ isSelected }) => css`
    ${isSelected && { zIndex: `${OPTION_OPEN_TRIP_CARD_Z_INDEX}` }}
    ${isSelected && { animation: 'boxShadowFlicker 2s infinite alternate' }}
  `};
  @keyframes boxShadowFlicker {
    0% {
    }
    100% {
      box-shadow: 0 0 15px white;
    }
  }
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        position: relative;
        width: 100%;
        height: 70px;
        padding: 0 10px;
      `;
    }
    return css`
      width: 245px;
      height: 256px;
    `;
  }}
  ${({ isMobile, isSelected }) => {
    if (isMobile && !isSelected) {
      return css`
        &:hover {
          border: 1px solid ${color.blue3};
        }
        cursor: pointer;
      `;
    }
  }}
`;

export default TripCard;
