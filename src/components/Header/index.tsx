import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import Logo from '@/components/common/Logo';
import MyProfileBtn from '@/components/MyProfileBtn';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';
import { HEADER_HEIGHT } from '@/styles/constants';

const Header = () => {
  const userStatus = useRecoilValue(UserStatus);

  const userStatusBtn =
    userStatus === UserStatusTypes.LOGIN ? (
      <MyProfileBtn />
    ) : (
      <LoginBtn>
        <Link to="/login">로그인</Link>
      </LoginBtn>
    );

  return (
    <HeaderBox>
      <Logo />
      <NavBox>
        <MyTripListBtn>
          <Link to="/trip-list">나의 여행 계획</Link>
        </MyTripListBtn>
        {userStatusBtn}
      </NavBox>
    </HeaderBox>
  );
};

const HeaderBox = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  height: ${HEADER_HEIGHT};
  width: 100%;
  padding: 0px 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
`;

const NavBox = styled.div`
  display: flex;
  align-items: center;
  color: #3867ff;
  font-size: 16px;
`;

const MyTripListBtn = styled(Button)`
  width: 124px;
  height: 94px;
  padding: 0px;
  line-height: 94px;
  font-size: 16px;
  color: inherit;
  text-align: center;
  border-radius: 0px;
  &:hover {
    background-color: #eaefff;
  }
`;

const LoginBtn = styled(Button)`
  width: 92px;
  height: 94px;
  padding: 0px;
  line-height: 94px;
  font-size: 16px;
  color: inherit;
  text-align: center;
  border-radius: 0px;
  &:hover {
    background-color: #eaefff;
  }
`;

export default Header;
