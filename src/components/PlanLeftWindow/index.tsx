import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { ReactComponent as LeftArrowIcon } from '@/assets/LeftArrow.svg';
import { ReactComponent as RightArrowIcon } from '@/assets/RightArrow.svg';
import DateTab from '@/components/DateTab';
import PlaceTab from '@/components/PlaceTab';
import color from '@/constants/color';
import { HEADER_HEIGHT } from '@/constants/size';
import { PLAN_LEFT_WINDOW_Z_INDEX } from '@/constants/zIndex';
import useGetDayList from '@/queryHooks/useGetDayList';

const DATE = 'date';
const PLACE = 'place';

const PlanLeftWindow = () => {
  const { id } = useParams();
  const { data: dayList } = useGetDayList({
    tripId: id as string,
  });
  const initFocusedTab = dayList && dayList[0]?.date ? PLACE : DATE;

  const [isWindowFold, setIsWindowFold] = useState(false);
  const [curFocusedTab, setCurFocusedTab] = useState(initFocusedTab);

  const handleTabClick = (
    event: React.MouseEvent,
    tab: typeof DATE | typeof PLACE
  ) => {
    setCurFocusedTab(tab);
  };

  return (
    <PlanLeftWindowBox isWindowFold={isWindowFold}>
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
    </PlanLeftWindowBox>
  );
};

const PlanLeftWindowBox = styled.div<{ isWindowFold: boolean }>`
  position: fixed;
  top: ${HEADER_HEIGHT};
  left: 0;
  width: 363px;
  height: calc(100% - ${HEADER_HEIGHT});
  ${props => (props.isWindowFold ? 'transform: translate(-363px);' : null)}
  transition: all .5s;
  background-color: ${color.white};
  z-index: ${PLAN_LEFT_WINDOW_Z_INDEX};
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
  background-color: #aaa;
`;

const TabBtn = styled.button<{ isFocused: boolean }>`
  width: 50%;
  height: 51px;
  color: #d9d9d9;
  font-weight: 700;
  font-size: 20px;
  border-bottom: 3px solid white;
  &:hover {
    border-bottom: 3px solid ${color.blue3};
    color: ${color.blue3};
  }
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

export default PlanLeftWindow;
