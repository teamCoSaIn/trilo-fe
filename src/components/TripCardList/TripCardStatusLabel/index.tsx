import { useMemo } from 'react';
import styled, { css } from 'styled-components';

import { TTripCardStatus } from '@/api/trip';
import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import Spacing from '@/components/common/Spacing';
import color from '@/constants/color';

interface ITripCardStatusLabelProps {
  status: TTripCardStatus;
}

const TripCardStatusLabel = ({ status }: ITripCardStatusLabelProps) => {
  // TODO: 날짜 계산

  const tripCardStatusContent = useMemo(() => {
    switch (status) {
      case 'BEFORE':
        return <>D - 10</>;
      case 'ON':
        return <>여행 18일차</>;
      case 'AFTER':
        return (
          <>
            여행 완료
            <Spacing width={5} />
            <CheckIcon width={10} height={10} fill={color.white} />
          </>
        );
      default:
        return null;
    }
  }, [status]);

  return status ? (
    <TripCardStatusLabelBox status={status}>
      {tripCardStatusContent}
    </TripCardStatusLabelBox>
  ) : null;
};

const TripCardStatusLabelBox = styled.div<{ status: TTripCardStatus }>`
  position: absolute;
  top: 16px;
  left: 16px;
  height: 23px;
  padding: 4px 13px;
  border-radius: 16.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  background-color: #4d77ff;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  ${({ status }) => css`
    ${status === 'BEFORE' && {
      backgroundColor: `${color.white}`,
      color: `${color.gray3}`,
    }};
    ${status === 'AFTER' && {
      backgroundColor: `${color.gray3}`,
      color: `${color.white}`,
    }};
  `}
`;

export default TripCardStatusLabel;
