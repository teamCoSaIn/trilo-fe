import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import Button from '@/components/common/Button';
import Description from '@/components/common/Description';
import Line from '@/components/common/Line';
import Logo from '@/components/common/Logo';
import Spacer from '@/components/common/Spacer';
import OAuthBtnContainer from '@/components/OAuthBtnContainer';
import UserStatus, { UserStatusTypes } from '@/states/userStatus';

const Login = () => {
  const redirectUrl = localStorage.getItem('redirectUrl') || '/';
  const navigate = useNavigate();
  const setUserStatus = useSetRecoilState(UserStatus);

  const handleVisitorBtnClick = () => {
    setUserStatus(UserStatusTypes.VISITOR);
    navigate(redirectUrl);
  };

  return (
    <Layout>
      <Logo width={76} height={50} />
      <Spacer top={85} bottom={35}>
        <Description color="#b8b8b8" fontSize={1.4}>
          SNS 간편 로그인
        </Description>
      </Spacer>
      <OAuthBtnContainer />
      <Spacer top={35} bottom={35}>
        <Line width={193} right={35} />
        <Description color="#b8b8b8" fontSize={1.4}>
          또는
        </Description>
        <Line width={193} left={35} />
      </Spacer>
      <Button type="button" onClick={handleVisitorBtnClick} btnSize="large">
        로그인 없이 둘러보기
      </Button>
    </Layout>
  );
};

export default Login;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
