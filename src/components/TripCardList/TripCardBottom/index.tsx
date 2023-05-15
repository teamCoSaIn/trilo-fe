import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { ITrip } from '@/api/trip';
import { ReactComponent as CameraIcon } from '@/assets/camera.svg';
import { ReactComponent as EllipsisIcon } from '@/assets/ellipsis.svg';
import { ReactComponent as MultiplyIcon } from '@/assets/multiply.svg';
import { ReactComponent as PencilIcon } from '@/assets/pencil.svg';
import { ReactComponent as TrashCanIcon } from '@/assets/trash-can.svg';
import DimLoader from '@/components/common/DimLoader';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import DynamicTripCardTitle from '@/components/TripCardList/DynamicTripCardTitle';
import color from '@/constants/color';
import useDeleteTrip from '@/queryHooks/useDeleteTrip';
import IsTitleEditFamily from '@/states/trip';

interface ITripCardBottomProps {
  trip: ITrip;
}

const TripCardBottom = ({ trip }: ITripCardBottomProps) => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const { mutate, isLoading } = useDeleteTrip();
  const setIsTitleEdit = useSetRecoilState(IsTitleEditFamily(trip.tripId));
  const tripPeriod = (
    <TripPeriod>
      {trip.startDay ? `${trip.startDay} ~ ${trip.endDay}` : ''}
    </TripPeriod>
  );

  const handleOptionOpenBtnClick = () => {
    setIsOptionOpen(true);
  };

  const handleEditTitleBtnClick = () => {
    setIsTitleEdit(true);
    setIsOptionOpen(false);
  };

  const handleDeleteBtnClick = () => {
    if (window.confirm('찐으로 삭제하시렵니까?')) {
      mutate(trip.tripId);
    }
  };

  const handleOptionCloseBtnClick = () => {
    setIsOptionOpen(false);
  };

  const BottomContent = isOptionOpen ? (
    <OptionBox>
      {isLoading && <DimLoader />}
      <OptionCloseBtn onClick={handleOptionCloseBtnClick}>
        <MultiplyIcon />
      </OptionCloseBtn>
      <IconBtn>
        <IconWrapper>
          <CameraIcon />
        </IconWrapper>
        사진 변경
      </IconBtn>
      <IconBtn onClick={handleEditTitleBtnClick}>
        <IconWrapper>
          <PencilIcon />
        </IconWrapper>
        이름 수정
      </IconBtn>
      <IconBtn onClick={handleDeleteBtnClick}>
        <IconWrapper>
          <TrashCanIcon />
        </IconWrapper>
        계획 삭제
      </IconBtn>
    </OptionBox>
  ) : (
    <BottomBox column alignCenter justifyCenter>
      <DynamicTripCardTitle tripCardId={trip.tripId} tripTitle={trip.title} />
      <Spacing height={9} />
      <Wrapper>
        {tripPeriod}
        <OptionOpenBtn onClick={handleOptionOpenBtnClick}>
          <EllipsisIcon />
        </OptionOpenBtn>
      </Wrapper>
    </BottomBox>
  );

  return BottomContent;
};

const BottomBox = styled(Flex)`
  width: 100%;
  height: 80px;
  padding: 14px 12px;
`;

const Wrapper = styled(Flex)`
  width: 100%;
  flex-grow: 1;
  justify-content: space-between;
  padding: 0 8px;
`;

const TripPeriod = styled.p`
  display: flex;
  align-items: center;
  color: ${color.gray2};
  font-size: 1.4rem;
`;

const OptionOpenBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OptionBox = styled(Flex)`
  position: relative;
  justify-content: space-evenly;
  width: 100%;
  height: 80px;
  padding: 14px 22px;
  &:hover {
    color: ${color.blue3};
  }
`;

const IconBtn = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  font-weight: 500;
  font-size: 12px;
  color: ${color.gray3};
  &:hover {
    color: ${color.blue3};
    > div {
      border-color: ${color.blue3};
      > svg {
        fill: ${color.blue3};
      }
    }
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 0.6px solid ${color.gray3};
`;

const OptionCloseBtn = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  &:hover {
    > svg {
      fill: ${color.blue3};
    }
  }
`;

export default TripCardBottom;
