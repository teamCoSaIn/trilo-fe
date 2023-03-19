import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';

import Logo from '@/components/common/Logo';
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
        <Description>SNS 간편 로그인</Description>
      </Spacer>
      <OAuthBtnContainer />
      <Spacer top={35} bottom={35}>
        <Line />
        <Description>또는</Description>
        <Line />
      </Spacer>
      <VisitorBtn type="button" onClick={handleVisitorBtnClick}>
        로그인 없이 둘러보기
      </VisitorBtn>
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

const Description = styled.p`
  font-size: 1.4rem;
  font-weight: 500;
  color: #b8b8b8;
`;

const Spacer = styled.div<{ top?: number; bottom?: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => css`
    ${props.top && { marginTop: props.top }}
    ${props.bottom && { marginBottom: props.bottom }}
  `};
`;

const Line = styled.div`
  height: 1px;
  width: 193px;
  border-top: 1px solid #f1f1f1;
  margin-left: 35px;
  margin-right: 35px;
`;

const VisitorBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 568px;
  height: 82px;
  background-color: #4d77ff;
  color: white;
  border-radius: 4rem;
  font-size: 2.3rem;
`;
