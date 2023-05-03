import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { PlanDay } from '@/api/planDay';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import ScheduleDropdown from '@/components/ScheduleTab/ScheduleDropdown';
import color from '@/constants/color';
import useGetDayList from '@/queryHooks/useGetDayList';
import { DropdownIndexFamily, DropdownMenuFamily } from '@/states/schedule';

const ScheduleTab = () => {
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

  const selectedDayList =
    dropdownMenuIdx === 0
      ? dayList?.slice(0, dayList.length - 1)
      : dayList?.slice(dropdownMenuIdx - 1, dropdownMenuIdx);

  return (
    <Box>
      <ScheduleDropdown tripId={tripId as string} />
      <DayList column>
        {selectedDayList?.map((day, idx) => {
          const [dayString, dateString] =
            dropdownMenuIdx === 0
              ? dropdownMenu[idx + 1].split('-')
              : dropdownMenu[dropdownMenuIdx].split('-');
          return (
            <Day key={day.dayId} column>
              <Flex alignCenter>
                <DayIndex>{dayString}</DayIndex>
                <DayDate>{dateString}</DayDate>
              </Flex>
              <Spacing height={10} />
              <ScheduleList column>
                <ScheduleArea column>
                  {day.schedules.length ? (
                    day.schedules.map(schedule => (
                      <Schedule key={schedule.scheduleId} alignCenter>
                        {schedule.title}
                      </Schedule>
                    ))
                  ) : (
                    <NoScheduleArea alignCenter justifyCenter>
                      일정이 없습니다.
                    </NoScheduleArea>
                  )}
                </ScheduleArea>
              </ScheduleList>
            </Day>
          );
        })}
      </DayList>
    </Box>
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

const Day = styled(Flex)``;

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

const ScheduleList = styled(Flex)``;

const Schedule = styled(Flex)`
  width: 330px;
  height: 37px;
  background-color: ${color.white};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  padding: 0 17px;
  font-weight: 700;
  font-size: 1.4rem;
  color: ${color.gray3};
`;

const ScheduleArea = styled(Flex)`
  gap: 10px;
`;

const NoScheduleArea = styled(Flex)`
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
