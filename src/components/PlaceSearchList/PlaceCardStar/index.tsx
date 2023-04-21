import styled from 'styled-components';

import { ReactComponent as GrayStarIcon } from '@/assets/GrayStar.svg';
import { ReactComponent as YellowStarIcon } from '@/assets/YellowStar.svg';

interface PlaceCardStarProps {
  rating: number | undefined;
}

const PlaceCardStar = ({ rating }: PlaceCardStarProps) => {
  const numOfYellowStar = Math.round(rating || 5);
  const numOfGrayStar = 5 - numOfYellowStar;

  const YellowStars = new Array(numOfYellowStar)
    .fill(null)
    .map((_, i) => <YellowStarIcon key={i} />);
  const GrayStars = new Array(numOfGrayStar)
    .fill(null)
    .map((_, i) => <GrayStarIcon key={i} />);

  return (
    <StarBox>
      {YellowStars}
      {GrayStars}
    </StarBox>
  );
};

const StarBox = styled.div`
  display: flex;
`;

export default PlaceCardStar;
