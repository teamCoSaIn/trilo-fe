import { useMemo } from 'react';
import styled, { css } from 'styled-components';

import { PlanCardStatus } from '@/api/planCard';
import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import { ReactComponent as PlaneIcon } from '@/assets/plane.svg';
import Spacing from '@/components/common/Spacing';
import color from '@/constants/color';

interface PlanCardStatusLabelProps {
  status: PlanCardStatus;
}

const PlanCardStatusLabel = ({ status }: PlanCardStatusLabelProps) => {
  // TODO: 날짜 계산

  const planCardStatusContent = useMemo(() => {
    switch (status) {
      case 'BEFORE':
        return <>D - 10</>;
      case 'ON':
        return (
          <>
            <PlaneIcon width={12} height={10} fill="white" />
            <Spacing width={5} />
            여행 중
          </>
        );
      case 'AFTER':
        return (
          <>
            여행 완료
            <Spacing width={5} />
            <CheckIcon width={10} height={10} />
          </>
        );
      default:
        return null;
    }
  }, [status]);

  return status ? (
    <PlanStatus status={status}>{planCardStatusContent}</PlanStatus>
  ) : null;
};

const PlanStatus = styled.div<{ status: PlanCardStatus }>`
  position: absolute;
  top: 8px;
  left: 8px;
  height: 23px;
  padding: 4px 13px;
  border-radius: 16.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  background-color: #4d77ff;
  color: white;
  ${({ status }) => css`
    ${status === 'AFTER' && {
      backgroundColor: `${color.white}`,
      color: `${color.gray3}`,
    }};
  `}
`;

export default PlanCardStatusLabel;
