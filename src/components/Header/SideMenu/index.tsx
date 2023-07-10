import Skeleton from '@mui/material/Skeleton';
import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import HTTP from '@/api';
import { ReactComponent as BackIcon } from '@/assets/RightArrow.svg';
import Flex from '@/components/common/Flex';
import MuiButton from '@/components/common/MuiButton';
import Spacing from '@/components/common/Spacing';
import SideMenuProfile from '@/components/Header/SideMenuProfile';
import { MOBILE_HEADER_HEIGHT } from '@/constants/size';
import useMedia from '@/hooks/useMedia';
import { IsSideMenuOpen } from '@/states/sideMenu';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

const SideMenu = () => {
  const { isMobile } = useMedia();

  const [userStatus, setUserStatus] = useRecoilState(UserStatus);
  const [isSideMenuOpen, setIsSideMenuOpen] = useRecoilState(IsSideMenuOpen);

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
    setIsSideMenuOpen(false);
  };

  const handleMyAccountClick = () => {
    navigate('/user');
    setIsSideMenuOpen(false);
  };

  const handleTripListBtnClick = () => {
    navigate('/triplist');
    setIsSideMenuOpen(false);
  };

  const handleBackBtnClick = () => {
    setIsSideMenuOpen(false);
  };

  const handleLogoutClick = async () => {
    navigate('/');
    setIsSideMenuOpen(false);

    try {
      await HTTP.logout();
      setUserStatus(UserStatusTypes.LOGOUT);
    } catch (e) {
      toast.error('logout fail. please retry.', {
        autoClose: 3000,
        pauseOnHover: false,
        draggable: false,
      });
    }
  };

  const userStatusProfile =
    userStatus === UserStatusTypes.LOGIN ? (
      <Flex justifyCenter alignCenter>
        <Suspense
          fallback={<Skeleton variant="circular" width={39} height={39} />}
        >
          <SideMenuProfile />
        </Suspense>
      </Flex>
    ) : (
      <Spacing width={40} />
    );

  const userStatusBtn =
    userStatus === UserStatusTypes.LOGIN ? (
      <>
        <SideMenuItem>
          <MuiButton
            fullWidth
            height={MOBILE_HEADER_HEIGHT}
            onClick={handleMyAccountClick}
          >
            내 정보
          </MuiButton>
        </SideMenuItem>
        <SideMenuItem>
          <MuiButton
            fullWidth
            height={MOBILE_HEADER_HEIGHT}
            onClick={handleLogoutClick}
          >
            로그아웃
          </MuiButton>
        </SideMenuItem>
      </>
    ) : (
      <SideMenuItem>
        <MuiButton
          fullWidth
          height={MOBILE_HEADER_HEIGHT}
          onClick={handleLoginClick}
        >
          로그인
        </MuiButton>
      </SideMenuItem>
    );

  return (
    <SideMenuBox isOpen={isSideMenuOpen && isMobile}>
      <SideMenuItemBox>
        <SideMenuItem>
          <Wrapper>
            {userStatusProfile}
            <BackBtn onClick={handleBackBtnClick}>
              <BackIcon width={15} />
            </BackBtn>
          </Wrapper>
        </SideMenuItem>
        <SideMenuItem>
          <MuiButton
            fullWidth
            height={MOBILE_HEADER_HEIGHT}
            onClick={handleTripListBtnClick}
          >
            나의 여행 계획
          </MuiButton>
        </SideMenuItem>
        {userStatusBtn}
      </SideMenuItemBox>
    </SideMenuBox>
  );
};

const SideMenuBox = styled.aside<{ isOpen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  background-color: white;
  z-index: 11;
  transition: all 0.5s;
  ${({ isOpen }) => {
    if (isOpen) {
      return css`
        width: 50%;
      `;
    }
    return css`
      width: 0;
    `;
  }}
  white-space: nowrap;
`;

const SideMenuItemBox = styled.ul``;

const SideMenuItem = styled.li`
  width: 100%;
  height: 70px;
  overflow: hidden;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
`;

const BackBtn = styled.button`
  path {
    stroke: #3842ff;
  }

  &:hover {
    path {
      stroke-width: 3;
    }
  }
`;

export default SideMenu;
