import { ClickAwayListener } from '@mui/material';
import React, { SyntheticEvent, useEffect, useRef } from 'react';
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
import {
  PreviewImgFamily,
  IsOptionOpenFamily,
  IsTitleEditFamily,
} from '@/states/trip';

interface ITripCardProps {
  trip: ITrip;
}

const TripCard = ({ trip }: ITripCardProps) => {
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

  return (
    <>
      {(isOptionOpen || isTitleEdit) && <DimLayer />}
      <ClickAwayListener onClickAway={handleTitleFormClickAway}>
        <TripCardBox
          column
          ref={tripCardRef}
          isSelected={isOptionOpen || isTitleEdit}
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

const TripCardBox = styled(Flex)<{ isSelected: boolean }>`
  width: 245px;
  height: 256px;
  background-color: ${color.white};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2.97356px 20px rgba(0, 0, 0, 0.1);
  ${({ isSelected }) => css`
    ${isSelected && { zIndex: `${OPTION_OPEN_TRIP_CARD_Z_INDEX}` }}
  `};
  animation: boxShadowFlicker 2s infinite alternate;
  @keyframes boxShadowFlicker {
    0% {
    }
    100% {
      box-shadow: 0 0 10px white;
    }
  }
`;

export default TripCard;
