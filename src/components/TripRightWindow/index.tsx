import { Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import styled from 'styled-components';

import CircularLoader from '@/components/common/CircularLoader';
import ScheduleDropdown from '@/components/ScheduleDropdown';
import ScheduleEditor from '@/components/ScheduleEditor';
import ScheduleList from '@/components/ScheduleList';
import color from '@/constants/color';
import { SelectedEditorScheduleId } from '@/states/schedule';

const TripRightWindow = () => {
  const { tripId } = useParams();

  const selectedEditorScheduleId = useRecoilValue(SelectedEditorScheduleId);
  const resetSelectedEditorScheduleId = useResetRecoilState(
    SelectedEditorScheduleId
  );

  useEffect(() => {
    return () => {
      resetSelectedEditorScheduleId();
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
    <TripRightWindowBox>
      <ScheduleDropdown tripId={tripId as string} />
      <ScheduleContent>{dynamicScheduleList}</ScheduleContent>
    </TripRightWindowBox>
  );
};

const TripRightWindowBox = styled.div`
  width: 400px;
  height: 100%;
  background-color: ${color.white};
  padding: 12px 17px;
  flex-shrink: 0;
  // MEMO: min-height 임시 설정 값임.
  min-height: 500px;
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
