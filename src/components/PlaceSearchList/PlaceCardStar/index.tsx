import styled from 'styled-components';

import { ReactComponent as GrayStarIcon } from '@/assets/GrayStar.svg';
import { ReactComponent as HalfStarIcon } from '@/assets/HalfStar.svg';
import { ReactComponent as YellowStarIcon } from '@/assets/YellowStar.svg';

interface PlaceCardStarProps {
  rating: number | undefined;
}

const PlaceCardStar = ({ rating }: PlaceCardStarProps) => {
  const newRating = rating || 0;
  let numOfYellowStar = Math.floor(newRating);
  let numOfHalfStar = 0;
  let numOfGrayStar = 5 - numOfYellowStar;

  if (newRating - numOfYellowStar >= 0.8) {
    numOfYellowStar += 1;
    numOfGrayStar -= 1;
  } else if (newRating - numOfYellowStar >= 0.3) {
    numOfHalfStar += 1;
    numOfGrayStar -= 1;
  }

  const YellowStars = new Array(numOfYellowStar)
    .fill(null)
    .map((_, i) => <YellowStarIcon key={i} />);
  const HalfStars = new Array(numOfHalfStar)
    .fill(null)
    .map((_, i) => <HalfStarIcon key={i} />);
  const GrayStars = new Array(numOfGrayStar)
    .fill(null)
    .map((_, i) => <GrayStarIcon key={i} />);

  return (
    <StarBox>
      {YellowStars}
      {HalfStars}
      {GrayStars}
    </StarBox>
  );
};

const StarBox = styled.div`
  display: flex;
`;

export default PlaceCardStar;
