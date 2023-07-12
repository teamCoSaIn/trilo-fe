import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

import { ReactComponent as HamburgerIcon } from '@/assets/Hamburger.svg';
import DimLayer from '@/components/common/DimLayer';
import Flex from '@/components/common/Flex';
import Logo from '@/components/common/Logo';
import MuiButton from '@/components/common/MuiButton';
import MyProfileBtn from '@/components/Header/MyProfileBtn';
import MyProfileBtnSkeleton from '@/components/Header/MyProfileBtnSkeleton';
import SideMenu from '@/components/Header/SideMenu';
import color from '@/constants/color';
import { HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from '@/constants/size';
import { HEADER_Z_INDEX } from '@/constants/zIndex';
import useMedia from '@/hooks/useMedia';
import { IsSideMenuOpen } from '@/states/sideMenu';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

const Header = () => {
  const { isMobile, isDesktop } = useMedia();
  const userStatus = useRecoilValue(UserStatus);

  const [isSideMenuOpen, setIsSideMenuOpen] = useRecoilState(IsSideMenuOpen);

  const userStatusBtn =
    userStatus === UserStatusTypes.LOGIN ? (
      <Suspense fallback={<MyProfileBtnSkeleton />}>
        <MyProfileBtn />
      </Suspense>
    ) : (
      <MuiButton width={92} height={HEADER_HEIGHT}>
        <HeaderLink to="/login">로그인</HeaderLink>
      </MuiButton>
    );

  const handleHamburgerBtnClick = () => {
    setIsSideMenuOpen(true);
  };

  const handleDimLayerClick = () => {
    setIsSideMenuOpen(false);
  };

  return (
    <HeaderBox isMobile={isMobile}>
      <Logo width={76} height={50} />
      {isDesktop && (
        <Flex alignCenter>
          <MuiButton width={124} height={HEADER_HEIGHT}>
            <HeaderLink to="/triplist">나의 여행 계획</HeaderLink>
          </MuiButton>
          {userStatusBtn}
        </Flex>
      )}
      {isMobile && (
        <MuiButton
          height={MOBILE_HEADER_HEIGHT}
          onClick={handleHamburgerBtnClick}
        >
          <HamburgerIcon />
        </MuiButton>
      )}
      {isSideMenuOpen && isMobile && <DimLayer onClick={handleDimLayerClick} />}
      <SideMenu />
    </HeaderBox>
  );
};

const HeaderBox = styled.header<{ isMobile: boolean }>`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${color.white};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  z-index: ${HEADER_Z_INDEX};
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        height: ${MOBILE_HEADER_HEIGHT}px;
        padding: 0 20px;
      `;
    }
    return css`
      height: ${HEADER_HEIGHT}px;
      padding: 0 80px;
    `;
  }}
`;

const HeaderLink = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Header;
