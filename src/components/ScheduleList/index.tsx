import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DragStart,
  DragUpdate,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import { IDailyPlan } from '@/api/plan';
import { ReactComponent as DownArrowIcon } from '@/assets/downArrow.svg';
import { ReactComponent as DeleteIcon } from '@/assets/multiply.svg';
import { ReactComponent as PlaceIcon } from '@/assets/place.svg';
import { ReactComponent as UpArrowIcon } from '@/assets/upArrow.svg';
import DimLoader from '@/components/common/DimLoader';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import color from '@/constants/color';
import {
  SCHEDULE_HEIGHT,
  SCHEDULE_WIDTH,
  SCHEDULE_MARGIN_TOP,
  SCHEDULE_MARGIN_BOTTOM,
  SCHEDULE_MARGIN_LEFT,
} from '@/constants/scheduleDnd';
import useChangeScheduleOrder from '@/queryHooks/useChangeScheduleOrder';
import useDeleteSchedule from '@/queryHooks/useDeleteSchedule';
import useGetDailyPlanList from '@/queryHooks/useGetDailyPlanList';
import useGetTempPlanList from '@/queryHooks/useGetTempPlanList';
import {
  DropdownIndexFamily,
  DropdownMenuFamily,
  IsTempBoxOpen,
  SelectedEditorScheduleId,
  SelectedMarkerScheduleId,
} from '@/states/schedule';

const ScheduleList = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { tripId } = useParams();

  const [dropdownMenu, setDropdownMenu] = useRecoilState(
    DropdownMenuFamily(tripId as string)
  );
  const dropdownMenuIdx = useRecoilValue(DropdownIndexFamily(tripId as string));
  const setSelectedEditorScheduleId = useSetRecoilState(
    SelectedEditorScheduleId
  );
  const selectedMarkerScheduleId = useRecoilValue(SelectedMarkerScheduleId);
  const [isTempBoxOpen, setIsTempBoxOpen] = useRecoilState(IsTempBoxOpen);

  const [placeholderClientY, setPlaceholderClientY] = useState<number | null>(
    null
  );

  const onSuccessCallback = (dailyPlanListData: IDailyPlan[]) => {
    const newDropdownMenu = dailyPlanListData.map((dailyPlanData, idx) => {
      return {
        dailyPlanId: dailyPlanData.dayId,
        name: `Day${idx + 1}`,
        date: `${dailyPlanData.date?.replace(/-/g, '.')}`,
        color: dailyPlanData.color.code,
      };
    });
    setDropdownMenu(newDropdownMenu);
  };

  const { data: dailyPlanListData, isFetching } = useGetDailyPlanList({
    tripId: +(tripId as string),
    onSuccess: onSuccessCallback,
  });

  const { data: tempPlanData } = useGetTempPlanList({
    tripId: +(tripId as string),
  });

  const { mutate: scheduleOrderMutate } = useChangeScheduleOrder();

  const { mutate: deleteMutate, isLoading: isDeleteLoading } =
    useDeleteSchedule();

  const selectedDailyPlanList =
    dropdownMenuIdx === -1
      ? dailyPlanListData
      : dailyPlanListData?.slice(dropdownMenuIdx, dropdownMenuIdx + 1);

  const handleDragEnd = (result: DropResult) => {
    if (!tripId) {
      return;
    }

    const { destination, source, draggableId } = result;

    // Day 밖으로 나가서 Drop 되는 경우
    if (!destination) {
      return;
    }

    // 같은 Day, 같은 자리에서 Drop 되는 경우
    if (
      destination.droppableId === source.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    scheduleOrderMutate({
      tripId: +tripId,
      scheduleId: +draggableId,
      sourceDailyPlanId: +source.droppableId,
      sourceScheduleIdx: source.index,
      destinationDailyPlanId: +destination.droppableId,
      destinationScheduleIdx: destination.index,
    });
  };

  const handleDragStart = (start: DragStart) => {
    const draggableHeight =
      SCHEDULE_HEIGHT + SCHEDULE_MARGIN_TOP + SCHEDULE_MARGIN_BOTTOM;

    const clientY = SCHEDULE_MARGIN_TOP + start.source.index * draggableHeight;

    setPlaceholderClientY(clientY);
  };

  const handleDragUpdate = (update: DragUpdate) => {
    if (!update.destination) {
      return;
    }
    const draggableHeight =
      SCHEDULE_HEIGHT + SCHEDULE_MARGIN_TOP + SCHEDULE_MARGIN_BOTTOM;

    const clientY =
      SCHEDULE_MARGIN_TOP + update.destination.index * draggableHeight;

    setPlaceholderClientY(clientY);
  };

  const handleTempPopUpBtnClick = () => {
    setIsTempBoxOpen(prev => !prev);
  };

  const handleScheduleDeleteBtnClick =
    (scheduleId: number) => (event: React.MouseEvent) => {
      event.stopPropagation();
      if (!tripId) {
        return;
      }
      if (window.confirm('찐으로 삭제하시겠습니까?')) {
        deleteMutate({
          tripId: +tripId,
          scheduleId,
        });
      }
    };

  const handleScheduleClick = (scheduleId: number) => () => {
    setSelectedEditorScheduleId(scheduleId);
  };

  const dailyPlanDragDropBox = (
    <DailyPlanList>
      {selectedDailyPlanList?.map((dailyPlan, dailyPlanIdx) => {
        const [dayString, dateString] =
          dropdownMenuIdx === -1
            ? [dropdownMenu[dailyPlanIdx].name, dropdownMenu[dailyPlanIdx].date]
            : [
                dropdownMenu[dropdownMenuIdx].name,
                dropdownMenu[dropdownMenuIdx].date,
              ];
        return (
          <DailyPlan key={dailyPlan.dayId}>
            <Flex alignCenter>
              <DailyPlanIndex>{dayString}</DailyPlanIndex>
              <DailyPlanDate>{dateString}</DailyPlanDate>
              <DailyPlanColor dailyPlanColor={dailyPlan.color.code} />
            </Flex>
            <Spacing height={10} />
            <Droppable droppableId={String(dailyPlan.dayId)}>
              {(droppableProvided, droppableSnapshot) => (
                <ScheduleListBox
                  {...droppableProvided.droppableProps}
                  ref={droppableProvided.innerRef}
                  isEmpty={!dailyPlan.schedules.length}
                >
                  {dailyPlan.schedules.length ? (
                    dailyPlan.schedules.map((schedule, scheduleIdx) => (
                      <Draggable
                        key={schedule.scheduleId}
                        draggableId={String(schedule.scheduleId)}
                        index={scheduleIdx}
                      >
                        {(draggableProvided, draggableSnapshot) => (
                          <Schedule
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.dragHandleProps}
                            {...draggableProvided.draggableProps}
                            isDragging={draggableSnapshot.isDragging}
                            onClick={handleScheduleClick(schedule.scheduleId)}
                            isSelectedMarker={
                              selectedMarkerScheduleId === schedule.scheduleId
                            }
                          >
                            <ScheduleTitle>{schedule.title}</ScheduleTitle>
                            <Place>
                              <PlaceIcon />
                              <PlaceName>
                                {schedule.placeName || '알 수 없는 장소'}
                              </PlaceName>
                            </Place>
                            <ScheduleDeleteBtn
                              onClick={handleScheduleDeleteBtnClick(
                                schedule.scheduleId
                              )}
                            >
                              <DeleteIcon
                                width={7}
                                height={7}
                                fill={color.gray2}
                              />
                            </ScheduleDeleteBtn>
                          </Schedule>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <NoScheduleMessage>
                      {droppableSnapshot.isDraggingOver
                        ? ''
                        : '일정이 없습니다.'}
                    </NoScheduleMessage>
                  )}
                  {droppableProvided.placeholder}
                  {placeholderClientY !== null &&
                    droppableSnapshot.isDraggingOver && (
                      <Ghost
                        style={{
                          top: placeholderClientY,
                          left: SCHEDULE_MARGIN_LEFT,
                        }}
                      />
                    )}
                </ScheduleListBox>
              )}
            </Droppable>
          </DailyPlan>
        );
      })}
    </DailyPlanList>
  );

  const tempPlanDragDropBox = (
    <TempBox>
      <TempPopUpBtn type="button" onClick={handleTempPopUpBtnClick}>
        {isTempBoxOpen ? (
          <DownArrowIcon width={27} height={15} strokeWidth={2} />
        ) : (
          <UpArrowIcon width={27} height={15} strokeWidth={2} />
        )}
      </TempPopUpBtn>
      <TempTitle>임시보관함</TempTitle>
      {tempPlanData ? (
        <Droppable droppableId={String(tempPlanData.dayId)}>
          {(droppableProvided, droppableSnapshot) => (
            <TempList
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
              isPopUpOpen={isTempBoxOpen}
            >
              {tempPlanData.schedules.map((schedule, scheduleIdx) => (
                <Draggable
                  key={schedule.scheduleId}
                  draggableId={String(schedule.scheduleId)}
                  index={scheduleIdx}
                >
                  {(draggableProvided, draggableSnapshot) => (
                    <Schedule
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.dragHandleProps}
                      {...draggableProvided.draggableProps}
                      isDragging={draggableSnapshot.isDragging}
                      onClick={handleScheduleClick(schedule.scheduleId)}
                      isSelectedMarker={
                        selectedMarkerScheduleId === schedule.scheduleId
                      }
                    >
                      <ScheduleTitle>{schedule.title}</ScheduleTitle>
                      <Place>
                        <PlaceIcon />
                        <PlaceName>
                          {schedule.placeName || '알 수 없는 장소'}
                        </PlaceName>
                      </Place>
                      <ScheduleDeleteBtn
                        onClick={() =>
                          handleScheduleDeleteBtnClick(schedule.scheduleId)
                        }
                      >
                        <DeleteIcon width={7} height={7} fill={color.gray2} />
                      </ScheduleDeleteBtn>
                    </Schedule>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
              {placeholderClientY !== null &&
                droppableSnapshot.isDraggingOver && (
                  <Ghost
                    style={{
                      top: placeholderClientY,
                      left: SCHEDULE_MARGIN_LEFT,
                    }}
                  />
                )}
            </TempList>
          )}
        </Droppable>
      ) : null}
    </TempBox>
  );

  return (
    <>
      <DragDropContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragUpdate={handleDragUpdate}
      >
        {isMounted ? (
          <>
            {dailyPlanDragDropBox}
            {tempPlanDragDropBox}
          </>
        ) : null}
      </DragDropContext>
      {(isDeleteLoading || isFetching) && <DimLoader />}
    </>
  );
};

const DailyPlanList = styled.ul`
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  padding: 46px 17px;
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const DailyPlan = styled.li`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`;

const DailyPlanIndex = styled.h3`
  font-weight: 700;
  font-size: 1.6rem;
  color: ${color.gray3};
  margin-right: 8px;
`;

const DailyPlanDate = styled.span`
  font-weight: 400;
  font-size: 1.2rem;
  color: ${color.gray2};
  margin-right: 10px;
`;

const DailyPlanColor = styled.div<{ dailyPlanColor: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-bottom: 2px;
  ${({ dailyPlanColor }) => css`
    ${dailyPlanColor && { backgroundColor: dailyPlanColor }}
  `};
`;

const ScheduleListBox = styled.ul<{ isEmpty: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 47px;
  ${({ isEmpty }) => {
    if (isEmpty) {
      return css`
        justify-content: center;
        align-items: center;
        max-height: 47px;
        background-color: #f2f2f2;
        box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.03);
        border-radius: 7px;
        font-weight: 400;
        font-size: 12px;
        color: #b6b6b6;
      `;
    }
    return css`
      max-height: 100vh;
    `;
  }};
`;

const Schedule = styled.li<{ isDragging: boolean; isSelectedMarker: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  width: ${SCHEDULE_WIDTH}px;
  height: ${SCHEDULE_HEIGHT}px;
  background-color: ${color.white};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  padding: 0 17px;
  color: ${color.gray3};
  margin-top: ${SCHEDULE_MARGIN_TOP}px;
  margin-left: ${SCHEDULE_MARGIN_LEFT}px;
  margin-right: 5px;
  margin-bottom: ${SCHEDULE_MARGIN_BOTTOM}px;
  border: 1px solid white;
  cursor: grab;
  ${({ isDragging, isSelectedMarker }) => {
    if (isDragging && !isSelectedMarker) {
      return css`
        border: 1px solid ${color.blue3};
      `;
    }
    if (isSelectedMarker) {
      return css`
        border: 1px solid ${color.blue2};
        box-shadow: 0 2px 8px ${color.blue2};
      `;
    }
  }};
`;

const ScheduleTitle = styled.span`
  flex-grow: 1;
  font-weight: 700;
  font-size: 1.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Place = styled(Flex)`
  flex-shrink: 0;
  gap: 5px;
  margin-left: 5px;
  margin-right: 13px;
`;

const PlaceName = styled.span`
  max-width: 100px;
  font-weight: 500;
  color: ${color.gray2};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ScheduleDeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
`;

const NoScheduleMessage = styled.span``;

const Ghost = styled.div`
  position: absolute;
  width: ${SCHEDULE_WIDTH}px;
  height: ${SCHEDULE_HEIGHT}px;
  background-color: ${color.white};
  border: 1px dashed ${color.blue3};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  opacity: 80%;
`;

const TempBox = styled.div`
  flex-shrink: 0;
  position: relative;
  width: 100%;
  min-height: 62px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 7px 7px 0 0;
  padding: 20px 16px;
`;

const TempTitle = styled.h3`
  font-weight: 700;
  font-size: 1.6rem;
  color: ${color.gray3};
`;

const TempList = styled.ul<{ isPopUpOpen: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.2s ease-out;
  ${({ isPopUpOpen }) => {
    if (isPopUpOpen) {
      return css`
        height: 312px;
        margin-top: 10px;
      `;
    }
    return css`
      height: 0;
    `;
  }};
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const TempPopUpBtn = styled.button`
  position: absolute;
  top: -31px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 30px;
  background-color: #ecf0ff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  border-radius: 3px 3px 0 0;
  &:hover {
    path {
      stroke: ${color.blue3};
    }
  }
`;

export default ScheduleList;
