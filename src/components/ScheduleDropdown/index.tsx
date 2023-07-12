import { ClickAwayListener } from '@mui/material';
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import { ReactComponent as DownArrowIcon } from '@/assets/downArrow.svg';
import { ReactComponent as UpArrowIcon } from '@/assets/upArrow.svg';
import { ReactComponent as WhiteCheckIcon } from '@/assets/whiteCheck.svg';
import Description from '@/components/common/Description';
import color from '@/constants/color';
import {
  DAILYPLAN_COLORS,
  TDailyPlanColorName,
} from '@/constants/dailyPlanColor';
import { SCHEDULE_TAB_DROPDOWN_Z_INDEX } from '@/constants/zIndex';
import useChangeDayColor from '@/queryHooks/useChangeDayColor';
import useGetDailyPlanList from '@/queryHooks/useGetDailyPlanList';
import {
  DropdownIndexFamily,
  SelectedEditorScheduleId,
  SelectedMarkerScheduleId,
} from '@/states/schedule';

interface IScheduleDropdownProps {
  tripId: string;
}

const ScheduleDropdown = ({ tripId }: IScheduleDropdownProps) => {
  const [dayDropdownIdx, setDayDropdownIdx] = useRecoilState(
    DropdownIndexFamily(tripId)
  );
  const resetDayDropdownIdx = useResetRecoilState(DropdownIndexFamily(tripId));
  const resetSelectedEditorScheduleId = useResetRecoilState(
    SelectedEditorScheduleId
  );
  const resetSelectedMarkerScheduleId = useResetRecoilState(
    SelectedMarkerScheduleId
  );

  const { data: dailyPlanListData } = useGetDailyPlanList({
    tripId: +(tripId as string),
  });
  const { mutate } = useChangeDayColor();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState<boolean>(false);
  const [isColorDropdownOpen, setIsColorDropdownOpen] =
    useState<boolean>(false);
  const [isColorDropdownBtnHover, setIsColorDropdownBtnHover] =
    useState<boolean>(false);

  const handleDayDropdownBtnClick = () => {
    setIsColorDropdownOpen(false);
    setIsDayDropdownOpen(prev => !prev);
  };

  const handleColorDropdownBtnClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDayDropdownOpen(false);
    setIsColorDropdownOpen(prev => !prev);
  };

  const handleDropdownItemClick = (idx: number) => () => {
    setDayDropdownIdx(idx);
    setIsDayDropdownOpen(false);
    resetSelectedEditorScheduleId();
    resetSelectedMarkerScheduleId();
  };

  const handleColorDropdownBtnMouseEnter = () => {
    setIsColorDropdownBtnHover(true);
  };

  const handleColorDropdownBtnMouseLeave = () => {
    setIsColorDropdownBtnHover(false);
  };

  useEffect(() => {
    return () => {
      resetDayDropdownIdx();
    };
  }, []);

  const selectedMenu =
    dayDropdownIdx === -1 || !dailyPlanListData
      ? null
      : dailyPlanListData.days[dayDropdownIdx];

  const handleColorBtnClick = (selectedColor: TDailyPlanColorName) => () => {
    if (!selectedMenu) {
      return;
    }
    mutate({
      tripId: +tripId,
      dayId: selectedMenu.dayId,
      colorName: selectedColor,
    });
  };

  const handleDropdownBoxClickAway = (event: Event | SyntheticEvent) => {
    if (
      dropdownRef.current &&
      dropdownRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setIsDayDropdownOpen(false);
    setIsColorDropdownOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleDropdownBoxClickAway}>
      <DropdownBox ref={dropdownRef}>
        <DropdownMenu
          onClick={handleDayDropdownBtnClick}
          isColorDropdownBtnHover={isColorDropdownBtnHover}
        >
          <SelectedDay fontSize={1.6}>
            {selectedMenu
              ? `Day${dayDropdownIdx + 1} - ${selectedMenu.date.replace(
                  /-/g,
                  '.'
                )}`
              : '전체일정'}
          </SelectedDay>
          {selectedMenu && (
            <ColorDropdownBtn
              type="button"
              onClick={handleColorDropdownBtnClick}
              onMouseEnter={handleColorDropdownBtnMouseEnter}
              onMouseLeave={handleColorDropdownBtnMouseLeave}
            />
          )}
          {isDayDropdownOpen ? <UpArrowIcon /> : <DownArrowIcon />}
        </DropdownMenu>
        <DropdownPopper isDropdownOpen={isDayDropdownOpen}>
          <DayBox>
            {dailyPlanListData?.days.map((day, idx) => (
              <DayMenu key={day.dayId} onClick={handleDropdownItemClick(idx)}>
                {`Day${idx + 1} - ${day.date.replace(/-/g, '.')}`}
              </DayMenu>
            ))}
            <DayMenu onClick={handleDropdownItemClick(-1)}>전체일정</DayMenu>
          </DayBox>
        </DropdownPopper>
        <DropdownPopper isDropdownOpen={isColorDropdownOpen}>
          <ColorBox>
            {Object.entries(DAILYPLAN_COLORS).map(
              ([dayColorName, dayColorCode]) => (
                <ColorMenu key={dayColorName}>
                  <ColorBtn
                    dayColor={dayColorCode}
                    onClick={handleColorBtnClick(
                      dayColorName as TDailyPlanColorName
                    )}
                  >
                    {dayColorName === selectedMenu?.dayColor.name && (
                      <WhiteCheckIcon />
                    )}
                  </ColorBtn>
                </ColorMenu>
              )
            )}
          </ColorBox>
        </DropdownPopper>
      </DropdownBox>
    </ClickAwayListener>
  );
};

const DropdownBox = styled.div`
  position: relative;
  z-index: ${SCHEDULE_TAB_DROPDOWN_Z_INDEX};
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;

const DropdownMenu = styled.div<{ isColorDropdownBtnHover: boolean }>`
  position: absolute;
  display: flex;
  align-items: center;
  height: 46px;
  width: 100%;
  color: ${color.gray3};
  background: #ffffff;
  border: 0.5px solid #4d77ff;
  border-radius: 23px;
  padding: 0 27px;
  z-index: ${SCHEDULE_TAB_DROPDOWN_Z_INDEX};
  cursor: pointer;
  ${({ isColorDropdownBtnHover }) => {
    return (
      !isColorDropdownBtnHover &&
      css`
        &:hover {
          path {
            stroke: ${color.blue3};
            stroke-width: 2;
          }
          color: #456ceb;
        }
      `
    );
  }}
`;

const SelectedDay = styled(Description)`
  flex-grow: 1;
  font-weight: 700;
  text-align: left;
`;

const DropdownPopper = styled.div<{ isDropdownOpen: boolean }>`
  position: absolute;
  top: 23px;
  width: 100%;
  background: #ffffff;
  border: 0.5px solid #4d77ff;
  border-bottom-left-radius: 23px;
  border-bottom-right-radius: 23px;
  overflow: hidden;
  transition: all 0.1s ease;
  ${({ isDropdownOpen }) => {
    if (isDropdownOpen) {
      return css`
        max-height: 100vh;
        padding-top: 23px;
      `;
    }
    return css`
      max-height: 0;
      padding-top: 0;
    `;
  }};
`;

const DayBox = styled.ul``;

const DayMenu = styled.li`
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.6rem;
  color: ${color.gray3};
  padding-left: 34px;
  cursor: pointer;
  &:hover {
    color: #456ceb;
    background-color: #ecf0ff;
  }
`;

const ColorDropdownBtn = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(180deg, #10bce4 0%, #7756ed 100%);
  margin-right: 25px;
  &:hover {
    border: 2px solid #456ceb;
  }
`;

const ColorBox = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 46px;
`;

const ColorMenu = styled.li``;

const ColorBtn = styled.button<{ dayColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 31px;
  height: 31px;
  border-radius: 50%;
  ${({ dayColor }) => css`
    ${dayColor && { backgroundColor: dayColor }}
  `};
`;

export default ScheduleDropdown;
