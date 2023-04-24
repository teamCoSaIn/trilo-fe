import styled from 'styled-components';

import { PlanCardData } from '@/api/tripPlanList';
import Flex from '@/components/common/Flex';
import PlanCardBottom from '@/components/PlanCardList/PlanCardBottom';
import PlanCardContent from '@/components/PlanCardList/PlanCardContent';

interface PlanCardProps {
  planCardData: PlanCardData;
}

const PlanCard = ({ planCardData }: PlanCardProps) => {
  return (
    <PlanCardBox column>
      <PlanCardContent planCardData={planCardData} />
      <PlanCardBottom planCardData={planCardData} />
    </PlanCardBox>
  );
};

const PlanCardBox = styled(Flex)`
  width: 245px;
  height: 256px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2.97356px 20px rgba(0, 0, 0, 0.1);
`;

export default PlanCard;
