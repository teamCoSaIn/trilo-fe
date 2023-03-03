import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import OAUTH_API from '@/api/oauth';

interface OAuthBtnProps {
  authorizationServer: string;
}

const OAuthBtn = ({ authorizationServer }: OAuthBtnProps) => {
  const { data: authUrl } = useQuery(['login-uri', authorizationServer], () =>
    OAUTH_API.LoginUri<string>(authorizationServer)
  );

  return (
    <ButtonBox>
      <a href={authUrl}>{authorizationServer}</a>
    </ButtonBox>
  );
};

export default OAuthBtn;

const ButtonBox = styled.div`
  padding: 10px;
  border: 1px solid black;
  width: 100px;
  margin-top: 20px;
  text-align: center;
`;
