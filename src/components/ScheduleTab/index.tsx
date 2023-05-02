import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { ReactComponent as DownArrowIcon } from '@/assets/downArrow.svg';
import { ReactComponent as UpArrowIcon } from '@/assets/upArrow.svg';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
import color from '@/constants/color';
import useGetDayList from '@/queryHooks/useGetDayList';

const ScheduleTab = () => {
  const { id } = useParams();
  const { data: dayList } = useGetDayList({
    planId: id as string,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [dropdownMenuIdx, setDropdownMenuIdx] = useState<number>(0);

  const dayMenus =
    dayList
      ?.filter(dayData => dayData.date)
      .map(
        (dayData, idx) => `Day${idx + 1} - ${dayData.date?.replace(/-/g, '.')}`
      ) || [];
  const dropdownMenus = ['전체일정', ...dayMenus];

  const handleClickDropdownBtn = () => setIsDropdownOpen(prev => !prev);

  const handleClickDropdownItem = (idx: number) => {
    setDropdownMenuIdx(idx);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <DropdownBox>
        <DropdownMenu alignCenter>
          <SelectedMenu fontSize={1.6} color={color.black}>
            {dropdownMenus[dropdownMenuIdx]}
          </SelectedMenu>
          <DropdownBtn type="button" onClick={handleClickDropdownBtn}>
            {isDropdownOpen ? <UpArrowIcon /> : <DownArrowIcon />}
          </DropdownBtn>
        </DropdownMenu>
        <DropdownPopper isDropdownOpen={isDropdownOpen}>
          {dayMenus.map((menu, idx) => (
            <DropdownItem
              key={idx}
              onClick={() => handleClickDropdownItem(idx + 1)}
            >
              {menu}
            </DropdownItem>
          ))}
          <DropdownItem onClick={() => handleClickDropdownItem(0)}>
            {dropdownMenus[0]}
          </DropdownItem>
        </DropdownPopper>
      </DropdownBox>
    </>
  );
};

const DropdownBox = styled.div`
  position: relative;
`;

const DropdownMenu = styled(Flex)`
  position: absolute;
  height: 46px;
  width: 364px;
  justify-content: space-between;
  color: ${color.gray3};
  background: #ffffff;
  border: 0.5px solid #4d77ff;
  border-radius: 23px;
  padding: 0 27px;
  z-index: 1;
`;

const SelectedMenu = styled(Description)`
  font-weight: 700;
`;

const DropdownPopper = styled.ul<{ isDropdownOpen: boolean }>`
  position: absolute;
  top: 23px;
  width: 364px;
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

const DropdownItem = styled.li`
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

const DropdownBtn = styled.button`
  &:hover {
    path {
      stroke: ${color.blue3};
    }
  }
`;
export default ScheduleTab;
