import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
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
import { SelectedScheduleId } from '@/states/schedule';

const ScheduleEditor = () => {
  const selectedScheduleId = useRecoilValue(SelectedScheduleId);

  const { data: scheduleDetails } = useGetScheduleDetails(selectedScheduleId);
  const { mutate } = useChangeScheduleDetails();

  const [contentInputValue, setContentInputValue] = useState(
    JSON.parse(scheduleDetails?.content || JSON.stringify(''))
  );
  const [titleInputValue, setTitleInputValue] = useState(
    scheduleDetails?.title
  );

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
          scheduleId: scheduleDetails.scheduleId,
          title: titleInputValue,
          content: JSON.stringify(contentInputValue),
        });
      }
    }, SCHEDULE_DETAILS_DEBOUNCE_TIME);

    return () => {
      if (debouncingTimer.current) {
        clearTimeout(debouncingTimer.current);
      }
    };
  }, [titleInputValue, contentInputValue]);

  const handleTitleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitleInputValue(event.target.value);
  };

  return (
    <ScheduleEditorBox>
      <ScheduleTitleBox alignCenter>
        <ScheduleTitle
          value={titleInputValue}
          onChange={handleTitleInputChange}
        />
        <CancelBtn>
          <CancelIcon width={13} height={13} fill="#4F4F4F" />
        </CancelBtn>
      </ScheduleTitleBox>
      <Spacing height={13} />
      <ScheduleTimeBox alignCenter>
        <ClockIcon />
        <TimeDescription>일정 시간</TimeDescription>
        <TimePicker />
        <Line left={6} right={6} width={30} color="#D9D9D9" />
        <TimePicker />
      </ScheduleTimeBox>
      <Spacing height={12} />
      <Line width={302} color="#B8B8B8" />
      <Spacing height={12} />
      <Editor>
        <BlockNoteView editor={editor} />
      </Editor>
      <PlaceNameBox>
        <LocationIcon />
        <PlaceName>{scheduleDetails?.placeName}</PlaceName>
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
`;

const CancelBtn = styled.button``;

const ScheduleTimeBox = styled(Flex)``;

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

const PlaceNameBox = styled.div`
  position: absolute;
  bottom: 18px;
  right: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PlaceName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #b8b8b8;
`;

export default ScheduleEditor;
