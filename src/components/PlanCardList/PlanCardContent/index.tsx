import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { PlanCardData } from '@/api/tripPlanList';
import { ReactComponent as DeleteIcon } from '@/assets/delete.svg';
import planCardDefaultPic from '@/assets/planCardDefaultPic.png';
import Button from '@/components/common/Button';
import DimLoader from '@/components/common/DimLoader';
import PlanCardStatusLabel from '@/components/PlanCardList/PlanCardStatusLabel';
import usePlanCardDelete from '@/hooks/usePlanCardDelete';

interface PlanCardContentProps {
  planCardData: PlanCardData;
}

const PlanCardContent = ({ planCardData }: PlanCardContentProps) => {
  const [isHover, setIsHover] = useState(false);
  const planContentPicUrl = planCardData.picUrl || planCardDefaultPic;

  const { mutate, isLoading } = usePlanCardDelete();

  const planPeriod = planCardData.startDay ? (
    <PlanPeriod>{`${planCardData.startDay} ~ ${planCardData.endDay}`}</PlanPeriod>
  ) : null;

  const handlePlanCardMouseEnter = () => {
    setIsHover(true);
  };

  const handlePlanCardMouseLeave = () => {
    setIsHover(false);
  };

  const handleDeleteBtnClick = () => {
    if (window.confirm('찐으로 삭제하시렵니까?')) {
      mutate(planCardData.id);
    }
  };

  const HoverMask = (
    <DimLayer>
      <Button type="button" btnSize="medium">
        <PlanBtnLink to={`/tripplan/${planCardData.id}`}>수정하기</PlanBtnLink>
      </Button>
      <DeleteBtn onClick={handleDeleteBtnClick}>
        <DeleteIcon />
      </DeleteBtn>
    </DimLayer>
  );

  return (
    <>
      {isLoading && <DimLoader />}
      <PlanContent
        picUrl={planContentPicUrl}
        onMouseEnter={handlePlanCardMouseEnter}
        onMouseLeave={handlePlanCardMouseLeave}
      >
        {isHover && HoverMask}
        <PlanCardStatusLabel status={planCardData.status} />
        {planPeriod}
      </PlanContent>
    </>
  );
};

const PlanContent = styled.div<{ picUrl: string }>`
  position: relative;
  width: 230px;
  height: 230px;
  ${({ picUrl }) => css`
    ${picUrl && { backgroundImage: `url(${picUrl})` }};
  `}
  background-size: cover;
`;

const PlanPeriod = styled.p`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 144px;
  height: 24px;
  border-radius: 16px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f4f4f;
  font-size: 1.4rem;
`;

const DimLayer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  &:hover {
    > svg {
      fill: #b8b8b8;
    }
  }
`;

const PlanBtnLink = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default PlanCardContent;
