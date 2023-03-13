import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import HTTP from '@/api';

interface OAuthBtnProps {
  oauthServer: string;
}

const OAuthBtn = ({ oauthServer }: OAuthBtnProps) => {
  const { data: authUrl } = useQuery(
    [`login-uri-${oauthServer}`],
    () => HTTP.getLoginUri(oauthServer),
    {
      suspense: true,
      staleTime: 1000 * 5 * 60,
    }
  );

  const handleOAuthBtnClick = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  return (
    <Button type="button" onClick={handleOAuthBtnClick}>
      {oauthServer}
    </Button>
  );
};

export default OAuthBtn;

const Button = styled.button`
  padding: 10px;
  border: 1px solid black;
  width: 100px;
  margin-top: 20px;
  text-align: center;
`;
