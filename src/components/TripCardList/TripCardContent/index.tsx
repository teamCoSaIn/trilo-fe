import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

import { ITrip } from '@/api/trip';
import tripCardDefaultPic from '@/assets/tripCardDefaultPic.png';
import TripCardStatusLabel from '@/components/TripCardList/TripCardStatusLabel';
import color from '@/constants/color';
import { TRIP_LIST_DIM_LAYER_Z_INDEX } from '@/constants/zIndex';
import useMedia from '@/hooks/useMedia';
import { PreviewImgFamily } from '@/states/trip';

interface ITripCardContentProps {
  trip: ITrip;
}

const TripCardContent = ({ trip }: ITripCardContentProps) => {
  const { isMobile } = useMedia();

  const [isHover, setIsHover] = useState(false);
  const previewImg = useRecoilValue(PreviewImgFamily(trip.tripId));

  const tripContentImageURL = previewImg || trip.imageURL || tripCardDefaultPic;

  const handleTripCardMouseEnter = () => {
    setIsHover(true);
  };

  const handleTripCardMouseLeave = () => {
    setIsHover(false);
  };

  const HoverMask = (
    <DimLayer>
      <TripEditBtn>
        <TripEditBtnLink to={`/triplist/${trip.tripId}`}>
          계획 수정하기
        </TripEditBtnLink>
      </TripEditBtn>
    </DimLayer>
  );

  return (
    <TripContent
      imageUrl={tripContentImageURL}
      isMobile={isMobile}
      onMouseEnter={handleTripCardMouseEnter}
      onMouseLeave={handleTripCardMouseLeave}
    >
      {!isMobile && isHover && HoverMask}
      {!isMobile && (
        <TripCardStatusLabel
          startDate={trip.startDate}
          endDate={trip.endDate}
        />
      )}
    </TripContent>
  );
};

const TripContent = styled.div<{ imageUrl: string; isMobile: boolean }>`
  position: relative;
  flex-shrink: 0;
  ${({ imageUrl }) => css`
    ${imageUrl && { backgroundImage: `url(${imageUrl})` }};
  `}
  background-size: cover;
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        width: 48px;
        height: 48px;
        border-radius: 50%;
      `;
    }
    return css`
      width: 100%;
      height: 176px;
    `;
  }}
`;

const DimLayer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.5125) 47.92%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: ${TRIP_LIST_DIM_LAYER_Z_INDEX};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TripEditBtn = styled.button`
  width: 133px;
  height: 36px;
  border: 0.8px solid ${color.white};
  border-radius: 24px;
  color: ${color.white};
  &:hover {
    background-color: rgba(24, 23, 23, 0.6);
  }
`;

const TripEditBtnLink = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
`;

export default TripCardContent;
