import { TripCardData } from '@/api/tripList';
import Flex from '@/components/common/Flex/index';
import Spacing from '@/components/common/Spacing/index';
import TripCardContent from '@/components/TripCardContent';
import TripCardTitle from '@/components/TripCardTitle';

interface TripCardProps {
  cardData: TripCardData;
}

const TripCard = ({ cardData }: TripCardProps) => {
  return (
    <Flex column>
      <TripCardContent cardData={cardData} />
      <Spacing height={16} />
      <TripCardTitle cardData={cardData} />
    </Flex>
  );
};

export default TripCard;
