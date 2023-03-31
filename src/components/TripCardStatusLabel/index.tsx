import { useMemo } from 'react';
import styled, { css } from 'styled-components';

import { TripCardStatus } from '@/api/tripList';
import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import { ReactComponent as PlaneIcon } from '@/assets/plane.svg';
import Spacing from '@/components/common/Spacing';
import color from '@/constants/color';

interface TripCardStatusLabelProps {
  status: TripCardStatus;
}

const TripCardStatusLabel = ({ status }: TripCardStatusLabelProps) => {
  // TODO: 날짜 계산

  const tripStatusContent = useMemo(() => {
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
      default:
        return (
          <>
            여행 완료
            <Spacing width={5} />
            <CheckIcon width={10} height={10} />
          </>
        );
    }
  }, [status]);

  return <TripStatus status={status}>{tripStatusContent}</TripStatus>;
};

const TripStatus = styled.div<{ status: TripCardStatus }>`
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

export default TripCardStatusLabel;
