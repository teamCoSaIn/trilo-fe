import { Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import CircularLoader from '@/components/common/CircularLoader';
import ScheduleDropdown from '@/components/ScheduleDropdown';
import ScheduleEditor from '@/components/ScheduleEditor';
import ScheduleList from '@/components/ScheduleList';
import color from '@/constants/color';
import useMedia from '@/hooks/useMedia';
import { IsTempBoxOpen, SelectedEditorScheduleId } from '@/states/schedule';

const TripRightWindow = () => {
  const { tripId } = useParams();
  const { isMobile } = useMedia();

  const selectedEditorScheduleId = useRecoilValue(SelectedEditorScheduleId);
  const resetSelectedEditorScheduleId = useResetRecoilState(
    SelectedEditorScheduleId
  );
  const resetIsTempBoxOpen = useResetRecoilState(IsTempBoxOpen);

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
    <TripRightWindowBox isMobile={isMobile}>
      <ScheduleDropdown tripId={tripId as string} />
      <ScheduleContent>{dynamicScheduleList}</ScheduleContent>
    </TripRightWindowBox>
  );
};

const TripRightWindowBox = styled.div<{ isMobile: boolean }>`
  background-color: ${color.white};
  padding: 12px 17px;
  flex-shrink: 0;
  // TODO: min-height 필요한지 체크
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        width: 100%;
        height: 60%;
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

export default TripRightWindow;
