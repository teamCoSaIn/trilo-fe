import { useState } from 'react';
import styled, { css } from 'styled-components';

import { TripCardData } from '@/api/tripList';
import { ReactComponent as DeleteIcon } from '@/assets/delete.svg';
import Button from '@/components/common/Button';
import TripCardStatusLabel from '@/components/TripCardStatusLabel';

interface TripCardContentProps {
  cardData: TripCardData;
}

const TripCardContent = ({ cardData }: TripCardContentProps) => {
  const [isHover, setIsHover] = useState(false);
  const handleTripCardMouseEnter = () => {
    setIsHover(true);
  };

  const handleTripCardMouseLeave = () => {
    setIsHover(false);
  };

  const HoverMask = (
    <DimLayer>
      <Button type="button" btnSize="medium">
        수정하기
      </Button>
      <DeleteBtn>
        <DeleteIcon />
      </DeleteBtn>
    </DimLayer>
  );

  return (
    <TripContent
      picUrl={cardData.picUrl}
      onMouseEnter={handleTripCardMouseEnter}
      onMouseLeave={handleTripCardMouseLeave}
    >
      {isHover && HoverMask}
      <TripCardStatusLabel status={cardData.status} />
      <TripPeriod>{`${cardData.startDay} ~ ${cardData.endDay}`}</TripPeriod>
    </TripContent>
  );
};

const TripContent = styled.div<{ picUrl: string }>`
  position: relative;
  width: 230px;
  height: 230px;
  ${({ picUrl }) => css`
    ${picUrl && { backgroundImage: `url(${picUrl})` }};
  `}
  background-size: cover;
`;

const TripPeriod = styled.p`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 144px;
  height: 24px;
  border-radius: 16px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f4f4f;
  font-size: 1.4rem;
`;

const DimLayer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  &:hover {
    > svg {
      fill: #b8b8b8;
    }
  }
`;

export default TripCardContent;
