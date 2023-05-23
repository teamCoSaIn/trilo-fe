import { ClickAwayListener } from '@mui/material';
import { SyntheticEvent, useEffect, useRef } from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { ITrip } from '@/api/trip';
import Flex from '@/components/common/Flex';
import TripCardBottom from '@/components/TripCardList/TripCardBottom';
import TripCardContent from '@/components/TripCardList/TripCardContent';
import {
  PreviewImgFamily,
  IsOptionOpenFamily,
  IsTitleEditFamily,
} from '@/states/trip';

interface ITripCardProps {
  trip: ITrip;
}

const TripCard = ({ trip }: ITripCardProps) => {
  const tripCardRef = useRef<HTMLDivElement>(null);

  const setIsOptionOpen = useSetRecoilState(IsOptionOpenFamily(trip.tripId));
  const setIsTitleEdit = useSetRecoilState(IsTitleEditFamily(trip.tripId));
  const resetPreviewImg = useResetRecoilState(PreviewImgFamily(trip.tripId));

  useEffect(() => {
    return () => {
      resetPreviewImg();
      setIsTitleEdit(false);
      setIsOptionOpen(false);
    };
  }, []);

  const handleTitleFormClickAway = (event: Event | SyntheticEvent) => {
    if (
      tripCardRef.current &&
      tripCardRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    resetPreviewImg();
    setIsTitleEdit(false);
    setIsOptionOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleTitleFormClickAway}>
      <TripCardBox column ref={tripCardRef}>
        <TripCardContent trip={trip} />
        <TripCardBottom trip={trip} />
      </TripCardBox>
    </ClickAwayListener>
  );
};

const TripCardBox = styled(Flex)`
  width: 245px;
  height: 256px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2.97356px 20px rgba(0, 0, 0, 0.1);
`;

export default TripCard;
