import Skeleton from '@mui/material/Skeleton';
import React from 'react';
import styled from 'styled-components';

import Flex from '@/components/common/Flex';

interface PlanCardListSkeletonProps {
  numOfPlanCard?: number;
}

interface DefaultProps {
  numOfPlanCard: number;
}

const PlanCardListSkeleton = ({
  numOfPlanCard = 7,
}: PlanCardListSkeletonProps | DefaultProps) => {
  const SkeletonList = Array.from({ length: numOfPlanCard + 1 }).map(
    (_, idx) => {
      const id = Date.now() + idx;
      return (
        <Flex column key={id}>
          <Skeleton variant="rounded" width={245} height={256} />
        </Flex>
      );
    }
  );

  return <PlanCardsBox>{SkeletonList}</PlanCardsBox>;
};

const PlanCardsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
`;

export default PlanCardListSkeleton;
