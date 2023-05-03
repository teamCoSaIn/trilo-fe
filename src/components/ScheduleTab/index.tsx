import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { PlanDay } from '@/api/planDay';
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

  const selectedDayList =
    dropdownMenuIdx === 0
      ? dayList?.slice(0, dayList.length - 1)
      : dayList?.slice(dropdownMenuIdx - 1, dropdownMenuIdx);

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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {isMounted ? (
        <Box>
          <ScheduleDropdown tripId={tripId as string} />
          <DayList column>
            {selectedDayList?.map((day, dayIdx) => {
              const [dayString, dateString] =
                dropdownMenuIdx === 0
                  ? dropdownMenu[dayIdx + 1].split('-')
                  : dropdownMenu[dropdownMenuIdx].split('-');
              return (
                <Day key={day.dayId} column>
                  <Flex alignCenter>
                    <DayIndex>{dayString}</DayIndex>
                    <DayDate>{dateString}</DayDate>
                  </Flex>
                  <Spacing height={10} />
                  <Droppable droppableId={String(day.dayId)}>
                    {droppableProvided => (
                      <ScheduleArea
                        column
                        {...droppableProvided.droppableProps}
                        ref={droppableProvided.innerRef}
                      >
                        {day.schedules.length ? (
                          <ScheduleList column>
                            {day.schedules.map((schedule, scheduleIdx) => (
                              <Draggable
                                key={schedule.scheduleId}
                                draggableId={String(schedule.scheduleId)}
                                index={scheduleIdx}
                              >
                                {draggableProvided => (
                                  <Schedule
                                    alignCenter
                                    ref={draggableProvided.innerRef}
                                    {...draggableProvided.dragHandleProps}
                                    {...draggableProvided.draggableProps}
                                  >
                                    <ScheduleTitle>
                                      {schedule.title}
                                    </ScheduleTitle>
                                  </Schedule>
                                )}
                              </Draggable>
                            ))}
                          </ScheduleList>
                        ) : (
                          <NoScheduleMessage alignCenter justifyCenter>
                            일정이 없습니다.
                          </NoScheduleMessage>
                        )}
                        {droppableProvided.placeholder}
                      </ScheduleArea>
                    )}
                  </Droppable>
                </Day>
              );
            })}
          </DayList>
        </Box>
      ) : null}
    </DragDropContext>
  );
};

const Box = styled.div`
  height: 100%;
  width: 100%;
  padding: 12px 17px;
  background-color: ${color.gray1};
`;

const DayList = styled(Flex)`
  gap: 20px;
  width: 364px;
  margin-top: 23px;
  padding: 46px 17px;
  background-color: #f6f6f6;
  border: 1px solid #d9d9d9;
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;

const Day = styled(Flex)`
  max-height: 200px;
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
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

const ScheduleArea = styled(Flex)``;

const ScheduleList = styled(Flex)`
  gap: 10px;
`;

const Schedule = styled(Flex)`
  width: 100%;
  height: 37px;
  background-color: ${color.white};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  padding: 0 17px;
  color: ${color.gray3};
`;

const ScheduleTitle = styled.span`
  font-weight: 700;
  font-size: 1.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NoScheduleMessage = styled(Flex)`
  width: 330px;
  height: 65px;
  background-color: #f2f2f2;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.03);
  border-radius: 7px;
  font-weight: 400;
  font-size: 12px;
  color: #b6b6b6;
`;

export default ScheduleTab;
