import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

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
    <LoginButtonBox>
      <OAuthBtnContainer />
      <VisitorBtn type="button" onClick={handleVisitorBtnClick}>
        로그인 없이 둘러보기
      </VisitorBtn>
    </LoginBtnBox>
  );
};

export default Login;

const LoginBtnBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem;
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
