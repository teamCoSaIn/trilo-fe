import { useQuery } from '@tanstack/react-query';
import { ReactElement } from 'react';

import HTTP from '@/api';

interface OAuthBtnProps {
  oauthServerName: string;
  oauthServerSvg: ReactElement;
}

const OAuthBtn = ({ oauthServerName, oauthServerSvg }: OAuthBtnProps) => {
  const { data: authUrl } = useQuery(
    [`login-uri-${oauthServerName}`],
    () => HTTP.getLoginUri(oauthServerName),
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
    <button type="button" onClick={handleOAuthBtnClick}>
      {oauthServerSvg}
    </button>
  );
};

export default OAuthBtn;
