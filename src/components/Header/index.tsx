import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import Flex from '@/components/common/Flex';
import Logo from '@/components/common/Logo';
import MuiButton from '@/components/common/MuiButton';
import MyProfileBtn from '@/components/Header/MyProfileBtn';
import { HEADER_HEIGHT } from '@/constants/size';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

const Header = () => {
  const userStatus = useRecoilValue(UserStatus);

  const userStatusBtn =
    userStatus === UserStatusTypes.LOGIN ? (
      <MyProfileBtn />
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
          <HeaderLink to="/tripplan-list">나의 여행 계획</HeaderLink>
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
`;

const HeaderLink = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export default Header;
