import styled, { css } from 'styled-components';

import { ITrip } from '@/api/trip';
import { ReactComponent as CheckIcon } from '@/assets/check.svg';
import Spacing from '@/components/common/Spacing';
import color from '@/constants/color';
import { transformDateToApiFormat } from '@/utils/calendar';

interface ITripCardStatusLabelProps {
  startDate: ITrip['startDate'];
  endDate: ITrip['endDate'];
}

type TTripCardStatus = 'BEFORE' | 'AFTER' | 'ON';

const TripCardStatusLabel = ({
  startDate,
  endDate,
}: ITripCardStatusLabelProps) => {
  const startDateNum = new Date(startDate).getTime();
  const endDateNum = new Date(endDate).getTime();
  const todayDateNum = new Date(transformDateToApiFormat(new Date())).getTime();

  const calDaysGap = (day1: number, day2: number): number => {
    return Math.floor(Math.abs(day1 - day2)) / (1000 * 60 * 60 * 24);
  };

  let status: TTripCardStatus;

  if (todayDateNum < startDateNum) {
    status = 'BEFORE';
  } else if (todayDateNum <= endDateNum) {
    status = 'ON';
  } else {
    status = 'AFTER';
  }

  let tripCardStatusContent;
  switch (status) {
    case 'BEFORE':
      tripCardStatusContent = `D - ${calDaysGap(startDateNum, todayDateNum)}`;
      break;
    case 'ON':
      tripCardStatusContent = `여행 ${
        calDaysGap(startDateNum, todayDateNum) + 1
      } 일차`;
      break;
    default:
      tripCardStatusContent = (
        <>
          여행 완료
          <Spacing width={5} />
          <CheckIcon width={10} height={10} fill={color.white} />
        </>
      );
  }

  return startDate ? (
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
