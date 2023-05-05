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
import { useRecoilState, useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

import { PlanDay } from '@/api/planDay';
import { ReactComponent as DownArrowIcon } from '@/assets/downArrow.svg';
import { ReactComponent as DeleteIcon } from '@/assets/multiply.svg';
import { ReactComponent as PlaceIcon } from '@/assets/place.svg';
import { ReactComponent as UpArrowIcon } from '@/assets/upArrow.svg';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import ScheduleDropdown from '@/components/ScheduleTab/ScheduleDropdown';
import color from '@/constants/color';
import useChangeScheduleOrder from '@/queryHooks/useChangeScheduleOrder';
import useGetDayList from '@/queryHooks/useGetDayList';
import { DropdownIndexFamily, DropdownMenuFamily } from '@/states/schedule';

const ScheduleTab = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { id: tripId } = useParams();

  const [dropdownMenu, setDropdownMenu] = useRecoilState(
    DropdownMenuFamily(tripId as string)
  );
  const dropdownMenuIdx = useRecoilValue(DropdownIndexFamily(tripId as string));

  const [placeholderClientY, setPlaceholderClientY] = useState<number | null>(
    null
  );

  const [isTemporaryBoxPopUp, setIsTemporaryBoxPopUp] = useState(false);

  const onSuccessCallback = (data: PlanDay[]) => {
    const dayList = data
      .filter(day => day.date)
      .map((day, idx) => `Day${idx + 1} - ${day.date?.replace(/-/g, '.')}`);

    setDropdownMenu(['전체일정', ...dayList]);
  };

  const { data: dayList } = useGetDayList({
    planId: tripId as string,
    onSuccess: onSuccessCallback,
  });

  const { mutate } = useChangeScheduleOrder();

  // TODO: 전역으로 필요함.
  const selectedDayList =
    dropdownMenuIdx === 0
      ? dayList?.slice(0, dayList.length - 1)
      : dayList?.slice(dropdownMenuIdx - 1, dropdownMenuIdx);

  const temporaryDay = dayList ? dayList[dayList.length - 1] : null;

  const handleDragEnd = (result: DropResult) => {
    if (!tripId) return;

    const { destination, source, draggableId } = result;

    // Day 밖으로 나가서 Drop 되는 경우
    if (!destination) return;

    // 같은 Day, 같은 자리에서 Drop 되는 경우
    if (
      destination.droppableId === source.droppableId &&
      source.index === destination.index
    )
      return;

    mutate({
      tripId,
      scheduleId: draggableId,
      sourceDayId: source.droppableId,
      sourceDayScheduleIdx: source.index,
      destinationDayId: destination.droppableId,
      destinationDayScheduleIdx: destination.index,
    });
  };

  const handleDragStart = (start: DragStart) => {
    const draggableHeight = 37 + 10;

    const clientY = start.source.index * draggableHeight;

    setPlaceholderClientY(clientY);
  };

  const handleDragUpdate = (update: DragUpdate) => {
    if (!update.destination) {
      return;
    }
    const draggableHeight = 37 + 10;

    const clientY = update.destination.index * draggableHeight;

    setPlaceholderClientY(clientY);
  };

  const handleTemporaryPopUpBtnClick = () => {
    setIsTemporaryBoxPopUp(prev => !prev);
  };

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
    >
      {isMounted ? (
        <Box column>
          <ScheduleDropdown tripId={tripId as string} />
          <DNDBox>
            <DayList>
              {selectedDayList?.map((day, dayIdx) => {
                const [dayString, dateString] =
                  dropdownMenuIdx === 0
                    ? dropdownMenu[dayIdx + 1].split('-')
                    : dropdownMenu[dropdownMenuIdx].split('-');
                return (
                  <Day key={day.dayId}>
                    <Flex alignCenter>
                      <DayIndex>{dayString}</DayIndex>
                      <DayDate>{dateString}</DayDate>
                    </Flex>
                    <Spacing height={10} />
                    <Droppable droppableId={String(day.dayId)}>
                      {(droppableProvided, droppableSnapshot) => (
                        <ScheduleList
                          {...droppableProvided.droppableProps}
                          ref={droppableProvided.innerRef}
                          isEmpty={!day.schedules.length}
                        >
                          {day.schedules.length ? (
                            day.schedules.map((schedule, scheduleIdx) => (
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
                                  >
                                    <ScheduleTitle>
                                      {schedule.title}
                                    </ScheduleTitle>
                                    {schedule.placeName && (
                                      <Place>
                                        <PlaceIcon />
                                        <PlaceName>
                                          {schedule.placeName}
                                        </PlaceName>
                                      </Place>
                                    )}
                                    <ScheduleDeleteBtn>
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
                                }}
                              />
                            )}
                        </ScheduleList>
                      )}
                    </Droppable>
                  </Day>
                );
              })}
            </DayList>
            <TemporaryBox>
              <TemporaryPopUpBtn
                type="button"
                onClick={handleTemporaryPopUpBtnClick}
              >
                {isTemporaryBoxPopUp ? (
                  <DownArrowIcon width={27} height={15} stroke-width={2} />
                ) : (
                  <UpArrowIcon width={27} height={15} stroke-width={2} />
                )}
              </TemporaryPopUpBtn>
              <TemporaryTitle>임시보관함</TemporaryTitle>
              {temporaryDay ? (
                <Droppable droppableId={String(temporaryDay.dayId)}>
                  {(droppableProvided, droppableSnapshot) => (
                    <TemporaryList
                      {...droppableProvided.droppableProps}
                      ref={droppableProvided.innerRef}
                      isPopUpOpen={isTemporaryBoxPopUp}
                    >
                      {temporaryDay.schedules.map((schedule, scheduleIdx) => (
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
                            >
                              <ScheduleTitle>{schedule.title}</ScheduleTitle>
                              {schedule.placeName && (
                                <Place>
                                  <PlaceIcon />
                                  <PlaceName>{schedule.placeName}</PlaceName>
                                </Place>
                              )}
                              <ScheduleDeleteBtn>
                                <DeleteIcon
                                  width={7}
                                  height={7}
                                  fill={color.gray2}
                                />
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
                            }}
                          />
                        )}
                    </TemporaryList>
                  )}
                </Droppable>
              ) : null}
            </TemporaryBox>
          </DNDBox>
        </Box>
      ) : null}
    </DragDropContext>
  );
};

const Box = styled(Flex)`
  height: 100%;
  width: 100%;
`;

const DNDBox = styled.div`
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

const DayList = styled.ul`
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

const Day = styled.li`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`;

const DayIndex = styled.h3`
  font-weight: 700;
  font-size: 1.6rem;
  color: ${color.gray3};
  margin-right: 8px;
`;

const DayDate = styled.span`
  font-weight: 400;
  font-size: 1.2rem;
  color: ${color.gray2};
`;

const ScheduleList = styled.ul<{ isEmpty: boolean }>`
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

const Schedule = styled.li<{ isDragging: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 37px;
  background-color: ${color.white};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  padding: 0 17px;
  color: ${color.gray3};
  margin-bottom: 10px;
  ${({ isDragging }) => {
    if (isDragging) {
      return css`
        border: 0.5px solid ${color.blue3};
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
`;

const NoScheduleMessage = styled.span``;

const Ghost = styled.div`
  position: absolute;
  width: 100%;
  height: 37px;
  background-color: ${color.white};
  border: 0.5px dashed ${color.blue3};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  opacity: 80%;
`;

const TemporaryBox = styled.div`
  flex-shrink: 0;
  position: relative;
  width: 100%;
  min-height: 62px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 7px 7px 0 0;
  padding: 20px 12px;
`;

const TemporaryTitle = styled.h3`
  font-weight: 700;
  font-size: 1.6rem;
  color: ${color.gray3};
  margin-left: 5px;
`;

const TemporaryList = styled.ul<{ isPopUpOpen: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 5px;
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

const TemporaryPopUpBtn = styled.button`
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

export default ScheduleTab;
