import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
    toast.info(
      <div>
        방문자 기능은 현재 개발 중입니다.
        <br />
        <br />
        다른 로그인 방법을 이용해주세요! 🙏
      </div>,
      {
        position: 'top-center',
        autoClose: 3000,
        pauseOnHover: false,
        draggable: false,
      }
    );
    // setUserStatus(UserStatusTypes.VISITOR);
    // navigate(redirectUrl);
  };

  return (
    <Layout column alignCenter>
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

const Layout = styled(Flex)`
  height: 100%;
  padding-top: 100px;
`;
