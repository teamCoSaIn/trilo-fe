import styled, { css } from 'styled-components';

import { TripCardData, TripCardStatus } from '@/api/tripList';
import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import { ReactComponent as PlaneIcon } from '@/assets/plane.svg';
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
        return <>D - 10</>;
      case 'ON':
        return (
          <>
            <PlaneIcon width={12} height={10} fill="white" />
            <Spacing width={5} />
            여행 중
          </>
        );
      default:
        return (
          <>
            여행 완료
            <Spacing width={5} />
            <CheckIcon width={10} height={10} />
          </>
        );
    }
  };

  return (
    <Flex column>
      <TripContent picUrl={cardData.picUrl}>
        <TripStatus status={cardData.status}>
          {getTripStatusContent(cardData.status)}
        </TripStatus>
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

const TripStatus = styled.div<{ status: TripCardStatus }>`
  position: absolute;
  top: 8px;
  left: 8px;
  height: 23px;
  padding: 4px 13px;
  border-radius: 16.5px;
  background-color: #4d77ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  ${({ status }) => css`
    ${status === 'AFTER' && {
      backgroundColor: `${color.white}`,
      color: `${color.gray3}`,
    }};
  `}
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
