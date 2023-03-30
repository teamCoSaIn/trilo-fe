import { TripCardData } from '@/api/tripList';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex/index';
import Spacing from '@/components/common/Spacing/index';
import TripCardContent from '@/components/TripCardContent';
import color from '@/constants/color';

interface TripCardProps {
  cardData: TripCardData;
}

const TripCard = ({ cardData }: TripCardProps) => {
  return (
    <Flex column>
      <TripCardContent cardData={cardData} />
      <Spacing height={16} />
      <Description color={color.gray3} fontSize={2}>
        {cardData.title}
      </Description>
    </Flex>
  );
};

export default TripCard;
