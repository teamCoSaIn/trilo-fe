import styled from 'styled-components';

interface OAuthBtnProps {
  authorizationServer: string;
  authUrl: string;
}

const OAuthBtn = ({ authorizationServer, authUrl }: OAuthBtnProps) => {
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
