import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import Logo from '@/components/common/Logo';
import MuiButton from '@/components/common/MuiButton';
import MyProfileBtn from '@/components/MyProfileBtn';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';
import { HEADER_HEIGHT } from '@/styles/constants';

const Header = () => {
  const userStatus = useRecoilValue(UserStatus);

  const userStatusBtn =
    userStatus === UserStatusTypes.LOGIN ? (
      <MyProfileBtn />
    ) : (
      <MuiButton width={92}>
        <Link to="/login">로그인</Link>
      </MuiButton>
    );

  return (
    <HeaderBox>
      <Logo width={76} height={50} />
      <NavBox>
        <MuiButton width={124}>
          <Link to="/trip-list">나의 여행 계획</Link>
        </MuiButton>
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
`;

export default Header;
