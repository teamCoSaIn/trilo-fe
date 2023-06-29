import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import styled from 'styled-components';

import { ReactComponent as ClockIcon } from '@/assets/clock.svg';
import { ReactComponent as LocationIcon } from '@/assets/location.svg';
import { ReactComponent as CancelIcon } from '@/assets/multiply.svg';
import Flex from '@/components/common/Flex';
import Line from '@/components/common/Line';
import Spacing from '@/components/common/Spacing';
import TimePicker from '@/components/ScheduleEditor/TimePicker';
import { SCHEDULE_DETAILS_DEBOUNCE_TIME } from '@/constants/debounce';
import useChangeScheduleDetails from '@/queryHooks/useChangeScheduleDetails';
import useGetScheduleDetails from '@/queryHooks/useGetScheduleDetails';
import { MapInstance } from '@/states/googleMaps';
import { SelectedEditorScheduleId } from '@/states/schedule';

const ScheduleEditor = () => {
  const { tripId } = useParams();

  const selectedEditorScheduleId = useRecoilValue(SelectedEditorScheduleId);
  const resetSelectedEditorScheduleId = useResetRecoilState(
    SelectedEditorScheduleId
  );
  const mapInstance = useRecoilValue(MapInstance);

  const { data: scheduleDetails } = useGetScheduleDetails(
    selectedEditorScheduleId
  );
  const { mutate } = useChangeScheduleDetails();

  const [titleInputValue, setTitleInputValue] = useState(
    scheduleDetails?.title
  );
  const [contentInputValue, setContentInputValue] = useState(
    JSON.parse(scheduleDetails?.content || JSON.stringify(''))
  );
  const [startTime, setStartTime] = useState(
    scheduleDetails?.scheduleTime.startTime
  );
  const [endTime, setEndTime] = useState(scheduleDetails?.scheduleTime.endTime);

  const debouncingTimer = useRef<NodeJS.Timeout | null>(null);

  const editor: BlockNoteEditor | null = useBlockNote({
    initialContent: contentInputValue,
    onEditorContentChange: (editorParams: BlockNoteEditor) => {
      setContentInputValue(editorParams.topLevelBlocks);
    },
  });

  useEffect(() => {
    debouncingTimer.current = setTimeout(() => {
      if (scheduleDetails) {
        mutate({
          tripId: +(tripId as string),
          dayId: scheduleDetails.dayId,
          scheduleId: scheduleDetails.scheduleId,
          title: titleInputValue || '',
          content: JSON.stringify(contentInputValue),
          startTime: startTime || scheduleDetails.scheduleTime.startTime,
          endTime: endTime || scheduleDetails.scheduleTime.endTime,
        });
      }
    }, SCHEDULE_DETAILS_DEBOUNCE_TIME);

    return () => {
      if (debouncingTimer.current) {
        clearTimeout(debouncingTimer.current);
      }
    };
  }, [titleInputValue, contentInputValue, startTime, endTime]);

  const handleTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitleInputValue(event.target.value);
  };

  const handleCancelBtnClick = () => {
    resetSelectedEditorScheduleId();
  };

  const handlePlaceNameBtnClick = () => {
    if (mapInstance && scheduleDetails) {
      mapInstance.setCenter({
        lat: scheduleDetails.coordinate.latitude,
        lng: scheduleDetails.coordinate.longitude,
      });
    }
  };

  return (
    <ScheduleEditorBox>
      <ScheduleTitleBox alignCenter>
        <ScheduleTitle
          value={titleInputValue}
          onChange={handleTitleInputChange}
          placeholder="Untitled..."
        />
        <CancelBtn onClick={handleCancelBtnClick}>
          <CancelIcon width={13} height={13} fill="#4F4F4F" />
        </CancelBtn>
      </ScheduleTitleBox>
      <Spacing height={13} />
      <Flex alignCenter>
        <ClockIcon />
        <TimeDescription>일정 시간</TimeDescription>
        <TimePicker
          time={scheduleDetails?.scheduleTime.startTime}
          setTime={setStartTime}
        />
        <Line left={6} right={6} width={30} color="#D9D9D9" />
        <TimePicker
          time={scheduleDetails?.scheduleTime.endTime}
          setTime={setEndTime}
        />
      </Flex>
      <Spacing height={12} />
      <Line width={302} color="#B8B8B8" />
      <Spacing height={12} />
      <Editor>
        <BlockNoteView editor={editor} />
      </Editor>
      <PlaceNameBox onClick={handlePlaceNameBtnClick}>
        <LocationIcon />
        <PlaceName>{scheduleDetails?.placeName || '알 수 없는 장소'}</PlaceName>
      </PlaceNameBox>
    </ScheduleEditorBox>
  );
};

const ScheduleEditorBox = styled.div`
  position: relative;
  height: 100%;
  margin: 46px 17px 15px 17px;
  padding: 11px 14px 18px 14px;
  background: #fff;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  overflow: hidden;
`;

const ScheduleTitleBox = styled(Flex)`
  justify-content: space-between;
`;

const ScheduleTitle = styled.input`
  width: 100%;
  font-size: 16px;
  font-weight: 700;
  ::placeholder {
    color: #bbb;
    font-weight: 500;
    font-style: italic;
  }
`;

const CancelBtn = styled.button``;

const TimeDescription = styled.span`
  font-size: 12px;
  font-weight: 400;
  margin: 0 18px 0 5px;
`;

const Editor = styled.div`
  width: 302px;
  height: calc(100% - 110px);
  overflow: auto;
`;

const PlaceNameBox = styled.button`
  position: absolute;
  bottom: 18px;
  right: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px;
  color: #b8b8b8;
  border-radius: 10px;
  &:hover {
    background-color: #4096ff;
    color: white;
    > svg > path {
      fill: white;
    }
  }
  transition: background-color 0.2s;
`;

const PlaceName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: inherit;
`;

export default ScheduleEditor;
