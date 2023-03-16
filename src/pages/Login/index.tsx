import styled from 'styled-components';

import OAuthBtnContainer from '@/components/OAuthBtnContainer';

const Login = () => {
  return (
    <LoginButtonBox>
      <OAuthBtnContainer />
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
