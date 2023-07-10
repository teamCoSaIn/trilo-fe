import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import Flex from '@/components/common/Flex';
import Logo from '@/components/common/Logo';
import MuiButton from '@/components/common/MuiButton';
import MyProfileBtn from '@/components/Header/MyProfileBtn';
import MyProfileBtnSkeleton from '@/components/Header/MyProfileBtnSkeleton';
import color from '@/constants/color';
import { HEADER_HEIGHT } from '@/constants/size';
import { HEADER_Z_INDEX } from '@/constants/zIndex';
import useMedia from '@/hooks/useMedia';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

const Header = () => {
  const { isMobile, isDesktop } = useMedia();
  const userStatus = useRecoilValue(UserStatus);

  const userStatusBtn =
    userStatus === UserStatusTypes.LOGIN ? (
      <Suspense fallback={<MyProfileBtnSkeleton />}>
        <MyProfileBtn />
      </Suspense>
    ) : (
      <MuiButton width={92}>
        <HeaderLink to="/login">로그인</HeaderLink>
      </MuiButton>
    );

  return (
    <HeaderBox>
      <Logo width={76} height={50} />
      <Flex alignCenter>
        <MuiButton width={124}>
          <HeaderLink to="/triplist">나의 여행 계획</HeaderLink>
        </MuiButton>
        {userStatusBtn}
      </Flex>
    </HeaderBox>
  );
};

const HeaderBox = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  height: ${HEADER_HEIGHT};
  width: 100%;
  padding: 0 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${color.white};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  z-index: ${HEADER_Z_INDEX};
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        padding: 0 20px;
      `;
    }
    return css`
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
