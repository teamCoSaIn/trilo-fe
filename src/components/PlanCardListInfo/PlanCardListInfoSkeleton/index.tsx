import Skeleton from '@mui/material/Skeleton';

import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';

const PlanCardListInfoSkeleton = () => {
  return (
    <Flex column>
      <Skeleton variant="rounded" width={200} height={23} />
      <Spacing height={13} />
      <Skeleton variant="rounded" width={150} height={13} />
    </Flex>
  );
};

export default PlanCardListInfoSkeleton;
