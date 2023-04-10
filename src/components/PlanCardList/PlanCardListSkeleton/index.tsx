import Skeleton from '@mui/material/Skeleton';
import React from 'react';
import styled from 'styled-components';

import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';

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
          <Skeleton variant="rounded" width={230} height={230} />
          <Spacing height={16} />
          <Skeleton variant="rounded" width={230} height={36} />
        </Flex>
      );
    }
  );

  return (
    <>
      <Flex column>
        <Skeleton variant="rounded" width={200} height={23} />
        <Spacing height={13} />
        <Skeleton variant="rounded" width={150} height={13} />
        <Spacing height={47} />
      </Flex>
      <PlanCardsBox>{SkeletonList}</PlanCardsBox>
    </>
  );
};

const PlanCardsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
`;

export default PlanCardListSkeleton;
