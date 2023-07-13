import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { ReactComponent as LeftArrowIcon } from '@/assets/LeftArrow.svg';
import { ReactComponent as RightArrowIcon } from '@/assets/RightArrow.svg';
import DateTab from '@/components/DateTab';
import PlaceTab from '@/components/PlaceTab';
import color from '@/constants/color';
import { TRIP_LEFT_WINDOW_Z_INDEX } from '@/constants/zIndex';
import useGetTrip from '@/queryHooks/useGetTrip';

const DATE = 'date';
const PLACE = 'place';

const TripLeftWindow = () => {
  const { tripId } = useParams();
  const { data: tripData } = useGetTrip({
    tripId: +(tripId as string),
  });
  const initFocusedTab = tripData && tripData.startDate ? PLACE : DATE;

  const [isWindowFold, setIsWindowFold] = useState(false);
  const [curFocusedTab, setCurFocusedTab] = useState(initFocusedTab);

  const handleTabClick = (
    event: React.MouseEvent,
    tab: typeof DATE | typeof PLACE
  ) => {
    setCurFocusedTab(tab);
  };

  return (
    <TripLeftWindowBox isWindowFold={isWindowFold}>
      <TabBtn
        isFocused={curFocusedTab === DATE}
        onClick={event => handleTabClick(event, DATE)}
      >
        날짜
      </TabBtn>
      <TabBtn
        isFocused={curFocusedTab === PLACE}
        onClick={event => handleTabClick(event, PLACE)}
      >
        장소
      </TabBtn>
      <InnerContents>
        {curFocusedTab === DATE ? <DateTab /> : <PlaceTab />}
      </InnerContents>
      <WindowFoldBtn
        onClick={() => {
          setIsWindowFold(prev => !prev);
        }}
      >
        {isWindowFold ? <RightArrowIcon /> : <LeftArrowIcon />}
      </WindowFoldBtn>
    </TripLeftWindowBox>
  );
};

const TripLeftWindowBox = styled.div<{ isWindowFold: boolean }>`
  position: relative;
  width: 374px;
  height: 100%;
  ${props => (props.isWindowFold ? 'width: 0px;' : null)}
  transition: width .5s;
  background-color: ${color.white};
  z-index: ${TRIP_LEFT_WINDOW_Z_INDEX};
  white-space: nowrap;
`;

const InnerContents = styled.div`
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 20px;
  }
  height: calc(100% - 51px);
  width: 100%;
`;

const WindowFoldBtn = styled.button`
  position: absolute;
  right: -30px;
  top: calc(50% - 30px);
  width: 30px;
  height: 60px;
  background-color: #ecf0ff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  border-radius: 0 3px 3px 0;
  &:hover {
    path {
      stroke: ${color.blue3};
    }
  }
`;

const TabBtn = styled.button<{ isFocused: boolean }>`
  width: 50%;
  height: 51px;
  color: #d9d9d9;
  font-weight: 700;
  font-size: 2rem;
  border-bottom: 3px solid white;
  &:hover {
    border-bottom: 3px solid ${color.blue3};
    color: ${color.blue3};
  }
  overflow: hidden;
  ${props =>
    props.isFocused
      ? css`
          border-bottom: 3px solid ${color.blue3};
          color: ${color.blue3};
        `
      : css`
          border-bottom: 3px solid white;
        `}
`;

export default TripLeftWindow;
