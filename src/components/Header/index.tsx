import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import Logo from '@/components/common/Logo';
import MyProfileBtn from '@/components/MyProfileBtn';
import RedirectUrl from '@/state/redirectUrl';
import UserStatus, { UserStatusTypes } from '@/state/userStatus';
import { HEADER_HEIGHT } from '@/styles/constants';

const Header = () => {
  const userStatus = useRecoilValue(UserStatus);
  const setRedirectUrl = useSetRecoilState(RedirectUrl);

  const handleLoginBtnClick = () => {
    setRedirectUrl(window.location.href);
  };

  const userStatusBtn =
    userStatus === UserStatusTypes.LOGIN ? (
      <MyProfileBtn />
    ) : (
      <LoginBtn to="/login" onClick={handleLoginBtnClick}>
        로그인
      </LoginBtn>
    );

  return (
    <HeaderBox>
      <Logo />
      <MyTripListBtn to="/trip-list">나의 여행 계획</MyTripListBtn>
      {userStatusBtn}
    </HeaderBox>
  );
};

const HeaderBox = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  height: ${HEADER_HEIGHT};
  width: 100%;
  display: flex;
  align-items: center;
  background-color: antiquewhite; // TODO: 삭제
  > * {
    margin-right: 2rem;
  }
`;

const MyTripListBtn = styled(Link)`
  font-size: 2rem;
  display: block;
`;

const LoginBtn = styled(Link)`
  font-size: 2rem;
  display: block;
`;

export default Header;
