import Skeleton from '@mui/material/Skeleton';
import React from 'react';
import styled, { css } from 'styled-components';

import Flex from '@/components/common/Flex';
import useMedia from '@/hooks/useMedia';

interface ITripCardListSkeletonProps {
  numOfTripCard?: number;
}

interface ITripCardListSkeletonDefaultProps {
  numOfTripCard: number;
}

const TripCardListSkeleton = ({
  numOfTripCard = 7,
}: ITripCardListSkeletonProps | ITripCardListSkeletonDefaultProps) => {
  const { isMobile } = useMedia();

  const SkeletonList = Array.from({ length: numOfTripCard + 1 }).map(
    (_, idx) => {
      const id = Date.now() + idx;
      return (
        <Flex column key={id}>
          <Skeleton
            variant="rounded"
            width={isMobile ? '100%' : 245}
            height={isMobile ? 70 : 256}
          />
        </Flex>
      );
    }
  );

  return <TripCardListBox isMobile={isMobile}>{SkeletonList}</TripCardListBox>;
};

const TripCardListBox = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        flex-direction: column;
      `;
    }
  }}
`;

export default TripCardListSkeleton;
