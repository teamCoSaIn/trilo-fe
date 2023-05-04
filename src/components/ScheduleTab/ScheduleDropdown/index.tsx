import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

import { ReactComponent as DownArrowIcon } from '@/assets/downArrow.svg';
import { ReactComponent as UpArrowIcon } from '@/assets/upArrow.svg';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
import color from '@/constants/color';
import { DropdownMenuFamily, DropdownIndexFamily } from '@/states/schedule';

interface ScheduleDropdownProps {
  tripId: string;
}
const ScheduleDropdown = ({ tripId }: ScheduleDropdownProps) => {
  const dropdownMenu = useRecoilValue(DropdownMenuFamily(tripId));
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [dropdownMenuIdx, setDropdownMenuIdx] = useRecoilState(
    DropdownIndexFamily(tripId)
  );

  const handleClickDropdownBtn = () => setIsDropdownOpen(prev => !prev);

  const handleClickDropdownItem = (idx: number) => {
    setDropdownMenuIdx(idx);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    return () => {
      setDropdownMenuIdx(0);
    };
  }, []);

  return (
    <DropdownBox>
      <DropdownMenu alignCenter>
        <SelectedMenu fontSize={1.6} color={color.black}>
          {dropdownMenu[dropdownMenuIdx]}
        </SelectedMenu>
        <DropdownBtn type="button" onClick={handleClickDropdownBtn}>
          {isDropdownOpen ? <UpArrowIcon /> : <DownArrowIcon />}
        </DropdownBtn>
      </DropdownMenu>
      <DropdownPopper isDropdownOpen={isDropdownOpen}>
        {dropdownMenu.map((menu, idx) => {
          if (idx === 0) return null;
          return (
            <DropdownItem
              key={menu}
              onClick={() => handleClickDropdownItem(idx)}
            >
              {menu}
            </DropdownItem>
          );
        })}
        <DropdownItem onClick={() => handleClickDropdownItem(0)}>
          {dropdownMenu[0]}
        </DropdownItem>
      </DropdownPopper>
    </DropdownBox>
  );
};

const DropdownBox = styled.div`
  position: relative;
  z-index: 1;
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

export default ScheduleDropdown;
