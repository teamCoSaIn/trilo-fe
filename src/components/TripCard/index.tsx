import styled, { css } from 'styled-components';

import { TripCardData, TripCardStatus } from '@/api/tripList';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex/index';
import Spacing from '@/components/common/Spacing/index';
import color from '@/constants/color';

interface TripCardProps {
  cardData: TripCardData;
}

const TripCard = ({ cardData }: TripCardProps) => {
  const getTripStatusContent = (status: TripCardStatus) => {
    switch (status) {
      case 'BEFORE':
        return `D-10`;
      case 'ON':
        return '여행 중';
      default:
        return '여행 완료';
    }
  };

  return (
    <Flex column key={cardData.id}>
      <TripContent picUrl={cardData.picUrl}>
        {/* TODO: 상태에 따라 컴포넌트 모양 변경 */}
        <TripStatus>{getTripStatusContent(cardData.status)}</TripStatus>
        <TripPeriod>{`${cardData.startDay} ~ ${cardData.endDay}`}</TripPeriod>
      </TripContent>
      <Spacing height={16} />
      <Description color={color.gray3} fontSize={2}>
        {cardData.title}
      </Description>
    </Flex>
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

const TripStatus = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 52px;
  height: 23px;
  border-radius: 15px;
  background-color: #4d77ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.4rem;
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

export default TripCard;
