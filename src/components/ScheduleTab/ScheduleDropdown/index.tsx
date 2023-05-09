import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

import { ReactComponent as DownArrowIcon } from '@/assets/downArrow.svg';
import { ReactComponent as UpArrowIcon } from '@/assets/upArrow.svg';
import { ReactComponent as WhiteCheckIcon } from '@/assets/whiteCheck.svg';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
import color from '@/constants/color';
import DailyPlanColor from '@/constants/dailyPlanColor';
import { DropdownMenuFamily, DropdownIndexFamily } from '@/states/schedule';

interface ScheduleDropdownProps {
  tripId: string;
}

const ScheduleDropdown = ({ tripId }: ScheduleDropdownProps) => {
  const dayDropdownMenu = useRecoilValue(DropdownMenuFamily(tripId));
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState<boolean>(false);
  const [dayDropdownIdx, setDayDropdownIdx] = useRecoilState(
    DropdownIndexFamily(tripId)
  );
  const [isColorDropdownOpen, setIsColorDropdownOpen] =
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

  const handleDropdownItemClick = (idx: number) => {
    setDayDropdownIdx(idx);
    setIsDayDropdownOpen(false);
  };

  useEffect(() => {
    return () => {
      setDayDropdownIdx(-1);
    };
  }, []);

  const selectedMenu =
    dayDropdownIdx === -1 ? null : dayDropdownMenu[dayDropdownIdx];

  const handleColorBtnClick = (selectedColor: string) => {
    console.log('dayId', selectedMenu?.dayId, 'color', selectedColor, '변경');
  };

  return (
    <DropdownBox>
      <DropdownMenu type="button" onClick={handleDayDropdownBtnClick}>
        <SelectedDay fontSize={1.6} color={color.black}>
          {selectedMenu
            ? `${selectedMenu.name} - ${selectedMenu.date}`
            : '전체일정'}
        </SelectedDay>
        {selectedMenu && (
          <ColorDropdownBtn
            type="button"
            onClick={handleColorDropdownBtnClick}
          />
        )}
        {isDayDropdownOpen ? <UpArrowIcon /> : <DownArrowIcon />}
      </DropdownMenu>
      <DropdownPopper isDropdownOpen={isDayDropdownOpen}>
        <DayBox>
          {dayDropdownMenu.map((menu, idx) => (
            <DayMenu
              key={menu.dayId}
              onClick={() => handleDropdownItemClick(idx)}
            >
              {`${menu.name} - ${menu.date}`}
            </DayMenu>
          ))}
          <DayMenu onClick={() => handleDropdownItemClick(-1)}>
            전체일정
          </DayMenu>
        </DayBox>
      </DropdownPopper>
      <DropdownPopper isDropdownOpen={isColorDropdownOpen}>
        <ColorBox>
          {DailyPlanColor.map(dayColor => (
            <ColorMenu key={dayColor}>
              <ColorBtn
                dayColor={dayColor}
                onClick={() => handleColorBtnClick(dayColor)}
              >
                {dayColor === selectedMenu?.color && <WhiteCheckIcon />}
              </ColorBtn>
            </ColorMenu>
          ))}
        </ColorBox>
      </DropdownPopper>
    </DropdownBox>
  );
};

const DropdownBox = styled.div`
  position: relative;
  z-index: 1;
`;

const DropdownMenu = styled.button`
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
  z-index: 1;
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
  font-size: 16px;
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
