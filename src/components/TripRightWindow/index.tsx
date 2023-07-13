import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import { ReactComponent as DownArrowIcon } from '@/assets/downArrow.svg';
import { ReactComponent as UpArrowIcon } from '@/assets/upArrow.svg';
import CircularLoader from '@/components/common/CircularLoader';
import ScheduleDropdown from '@/components/ScheduleDropdown';
import ScheduleEditor from '@/components/ScheduleEditor';
import ScheduleList from '@/components/ScheduleList';
import color from '@/constants/color';
import useMedia from '@/hooks/useMedia';
import { IsTempBoxOpen, SelectedEditorScheduleId } from '@/states/schedule';

const RIGHT_WINDOW_POP_UP_BTN_HEIGHT = '30px';

const TripRightWindow = () => {
  const { tripId } = useParams();
  const { isMobile } = useMedia();

  const selectedEditorScheduleId = useRecoilValue(SelectedEditorScheduleId);
  const resetSelectedEditorScheduleId = useResetRecoilState(
    SelectedEditorScheduleId
  );
  const resetIsTempBoxOpen = useResetRecoilState(IsTempBoxOpen);

  const [isRightWindowPopUp, setIsRightWindowPopUp] = useState<boolean>(false);

  const handleRightWindowPopUpBtnClick = () => {
    setIsRightWindowPopUp(prev => !prev);
  };

  useEffect(() => {
    return () => {
      resetSelectedEditorScheduleId();
      resetIsTempBoxOpen();
    };
  }, []);

  const dynamicScheduleList = selectedEditorScheduleId ? (
    <Suspense fallback={<CircularLoader />}>
      <ScheduleEditor />
    </Suspense>
  ) : (
    <ScheduleList />
  );

  return (
    <TripRightWindowBox
      isMobile={isMobile}
      isRightWindowPopUp={isRightWindowPopUp}
    >
      {isMobile && (
        <RightWindowPopUpBtn
          type="button"
          onClick={handleRightWindowPopUpBtnClick}
        >
          {isRightWindowPopUp ? (
            <DownArrowIcon width={27} height={15} strokeWidth={2} />
          ) : (
            <UpArrowIcon width={27} height={15} strokeWidth={2} />
          )}
        </RightWindowPopUpBtn>
      )}
      <ScheduleDropdown tripId={tripId as string} />
      <ScheduleContent>{dynamicScheduleList}</ScheduleContent>
    </TripRightWindowBox>
  );
};

const TripRightWindowBox = styled.div<{
  isMobile: boolean;
  isRightWindowPopUp: boolean;
}>`
  // TODO: min-height 필요한지 체크
  position: relative;
  background-color: ${color.white};
  padding: 12px 17px;
  flex-shrink: 0;
  ${({ isMobile, isRightWindowPopUp }) => {
    if (isMobile) {
      return css`
        width: 100%;
        height: ${isRightWindowPopUp ? '70%' : '40%'};
        transition: height 0.5s;
      `;
    }
    return css`
      width: 400px;
      height: 100%;
    `;
  }}
`;

const ScheduleContent = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 23px);
  width: 100%;
  margin-top: 23px;
  border: 1px solid #d9d9d9;
  background-color: #f6f6f6;
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;

const RightWindowPopUpBtn = styled.button`
  position: absolute;
  top: -${RIGHT_WINDOW_POP_UP_BTN_HEIGHT};
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: ${RIGHT_WINDOW_POP_UP_BTN_HEIGHT};
  background-color: #ecf0ff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  border-radius: 3px 3px 0 0;
  &:hover {
    path {
      stroke: ${color.blue3};
    }
  }
`;

export default TripRightWindow;
