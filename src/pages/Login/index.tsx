import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import Button from '@/components/common/Button';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
import Line from '@/components/common/Line';
import Logo from '@/components/common/Logo';
import Spacing from '@/components/common/Spacing';
import OAuthBtnContainer from '@/components/OAuthBtnContainer';
import color from '@/constants/color';
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
      <Spacing height={85} />
      <Description color={color.gray2} fontSize={1.4}>
        SNS 간편 로그인
      </Description>
      <Spacing height={35} />
      <OAuthBtnContainer />
      <Spacing height={35} />
      <Flex alignCenter>
        <Line width={193} right={35} />
        <Description color={color.gray2} fontSize={1.4}>
          또는
        </Description>
        <Line width={193} left={35} />
      </Flex>
      <Spacing height={35} />
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
