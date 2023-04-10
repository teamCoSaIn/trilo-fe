import { PlanCardData } from '@/api/tripPlanList';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import DynamicPlanCardTitle from '@/components/PlanCardList/DynamicPlanCardTitle';
import PlanCardContent from '@/components/PlanCardList/PlanCardContent';

interface PlanCardProps {
  planCardData: PlanCardData;
}

const PlanCard = ({ planCardData }: PlanCardProps) => {
  return (
    <Flex column>
      <PlanCardContent planCardData={planCardData} />
      <Spacing height={16} />
      <DynamicPlanCardTitle planCardData={planCardData} />
    </Flex>
  );
};

export default PlanCard;
