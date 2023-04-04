import { TripCardData } from '@/api/tripList';
import Flex from '@/components/common/Flex/index';
import Spacing from '@/components/common/Spacing/index';
import DynamicTripCardTitle from '@/components/DynamicTripCardTitle';
import TripCardContent from '@/components/TripCardContent';

interface TripCardProps {
  cardData: TripCardData;
}

const TripCard = ({ cardData }: TripCardProps) => {
  return (
    <Flex column>
      <TripCardContent cardData={cardData} />
      <Spacing height={16} />
      <DynamicTripCardTitle cardData={cardData} />
    </Flex>
  );
};

export default TripCard;
