import styled from 'styled-components';

import { ITrip } from '@/api/trip';
import Flex from '@/components/common/Flex';
import TripCardBottom from '@/components/TripCardList/TripCardBottom';
import TripCardContent from '@/components/TripCardList/TripCardContent';

interface TripCardProps {
  trip: ITrip;
}

const TripCard = ({ trip }: TripCardProps) => {
  return (
    <TripCardBox column>
      <TripCardContent trip={trip} />
      <TripCardBottom trip={trip} />
    </TripCardBox>
  );
};

const TripCardBox = styled(Flex)`
  width: 245px;
  height: 256px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2.97356px 20px rgba(0, 0, 0, 0.1);
`;

export default TripCard;
