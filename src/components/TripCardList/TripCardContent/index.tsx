import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

import { ITrip } from '@/api/trip';
import tripCardDefaultPic from '@/assets/tripCardDefaultPic.png';
import TripCardStatusLabel from '@/components/TripCardList/TripCardStatusLabel';
import color from '@/constants/color';
import { LOADING_Z_INDEX } from '@/constants/zIndex';
import { ImgPreviewFamily } from '@/states/trip';

interface ITripCardContentProps {
  trip: ITrip;
}

const TripCardContent = ({ trip }: ITripCardContentProps) => {
  const [isHover, setIsHover] = useState(false);
  const tripImgPreview = useRecoilValue(ImgPreviewFamily(trip.tripId));

  const tripContentPicUrl = tripImgPreview || trip.picUrl || tripCardDefaultPic;

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
      picUrl={tripContentPicUrl}
      onMouseEnter={handleTripCardMouseEnter}
      onMouseLeave={handleTripCardMouseLeave}
    >
      {isHover && HoverMask}
      <TripCardStatusLabel status={trip.status} />
    </TripContent>
  );
};

const TripContent = styled.div<{ picUrl: string }>`
  position: relative;
  width: 100%;
  height: 176px;
  ${({ picUrl }) => css`
    ${picUrl && { backgroundImage: `url(${picUrl})` }};
  `}
  background-size: cover;
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
  z-index: ${LOADING_Z_INDEX};
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
