import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { ReactComponent as LeftArrowIcon } from '@/assets/LeftArrow.svg';
import { ReactComponent as RightArrowIcon } from '@/assets/RightArrow.svg';
import DateTab from '@/components/DateTab';
import PlaceTab from '@/components/PlaceTab';
import color from '@/constants/color';
import { HEADER_HEIGHT } from '@/constants/size';
import useGetDayList from '@/queryHooks/useGetDayList';

const DATE = 'date';
const PLACE = 'place';

const PlanLeftWindow = () => {
  const { id } = useParams();
  const { data: dayList } = useGetDayList({
    planId: id as string,
  });
  const initFocusedTab = dayList && dayList[0].date === 'none' ? DATE : PLACE;

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
      <InnerContents>
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
  z-index: 4;
`;

const InnerContents = styled.div`
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  height: 100%;
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
