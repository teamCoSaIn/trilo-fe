import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { PlanCardData } from '@/api/planCard';
import planCardDefaultPic from '@/assets/planCardDefaultPic.png';
import PlanCardStatusLabel from '@/components/PlanCardList/PlanCardStatusLabel';
import color from '@/constants/color';
import { LOADING_Z_INDEX } from '@/constants/zIndex';

interface PlanCardContentProps {
  planCardData: PlanCardData;
}

const PlanCardContent = ({ planCardData }: PlanCardContentProps) => {
  const [isHover, setIsHover] = useState(false);
  const planContentPicUrl = planCardData.picUrl || planCardDefaultPic;

  const handlePlanCardMouseEnter = () => {
    setIsHover(true);
  };

  const handlePlanCardMouseLeave = () => {
    setIsHover(false);
  };

  const HoverMask = (
    <DimLayer>
      <PlanBtn>
        <PlanBtnLink to={`/tripplan/${planCardData.id}`}>
          계획 수정하기
        </PlanBtnLink>
      </PlanBtn>
    </DimLayer>
  );

  return (
    <PlanContent
      picUrl={planContentPicUrl}
      onMouseEnter={handlePlanCardMouseEnter}
      onMouseLeave={handlePlanCardMouseLeave}
    >
      {isHover && HoverMask}
      <PlanCardStatusLabel status={planCardData.status} />
    </PlanContent>
  );
};

const PlanContent = styled.div<{ picUrl: string }>`
  position: relative;
  width: 100%;
  height: 176px;
  ${({ picUrl }) => css`
    ${picUrl && { backgroundImage: `url(${picUrl})` }};
  `}
  background-size: cover;
`;

const DimLayer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.5125) 47.92%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: ${LOADING_Z_INDEX};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlanBtn = styled.button`
  width: 133px;
  height: 36px;
  border: 0.8px solid ${color.white};
  border-radius: 24px;
  color: ${color.white};
  &:hover {
    background-color: rgba(24, 23, 23, 0.6);
  }
`;

const PlanBtnLink = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
`;

export default PlanCardContent;
