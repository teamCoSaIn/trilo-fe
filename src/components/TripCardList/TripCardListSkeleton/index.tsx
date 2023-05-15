import Skeleton from '@mui/material/Skeleton';
import React from 'react';
import styled from 'styled-components';

import Flex from '@/components/common/Flex';

interface ITripCardListSkeletonProps {
  numOfTripCard?: number;
}

interface ITripCardListSkeletonDefaultProps {
  numOfTripCard: number;
}

const TripCardListSkeleton = ({
  numOfTripCard = 7,
}: ITripCardListSkeletonProps | ITripCardListSkeletonDefaultProps) => {
  const SkeletonList = Array.from({ length: numOfTripCard + 1 }).map(
    (_, idx) => {
      const id = Date.now() + idx;
      return (
        <Flex column key={id}>
          <Skeleton variant="rounded" width={245} height={256} />
        </Flex>
      );
    }
  );

  return <TripCardListBox>{SkeletonList}</TripCardListBox>;
};

const TripCardListBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
`;

export default TripCardListSkeleton;
