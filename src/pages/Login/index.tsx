import styled from 'styled-components';

import OAuthBtn from './OAuthBtn';

const Login = () => {
  // 백엔드한테 authorization 로그인 페이지 url 요청 후 각각의 버튼에게 주소 넘겨주기

  return (
    <LoginButtonBox>
      <OAuthBtn authorizationServer="google" />
      <OAuthBtn authorizationServer="naver" />
      <OAuthBtn authorizationServer="kakao" />
    </LoginButtonBox>
  );
};

export default Login;

const LoginButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem;
`;
