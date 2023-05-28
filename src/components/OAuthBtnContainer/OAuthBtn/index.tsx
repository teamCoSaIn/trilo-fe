import { useQuery } from '@tanstack/react-query';
import { ReactElement } from 'react';

import HTTP from '@/api';

interface IOAuthBtnProps {
  oauthServerName: string;
  oauthServerSvg: ReactElement;
}

const OAuthBtn = ({ oauthServerName, oauthServerSvg }: IOAuthBtnProps) => {
  const { data: authUrlData } = useQuery(
    [`login-uri-${oauthServerName}`],
    () => HTTP.getLoginUri(oauthServerName),
    {
      suspense: true,
      staleTime: 1000 * 5 * 60,
    }
  );

  const handleOAuthBtnClick = () => {
    if (authUrlData) {
      window.location.href = authUrlData.uri;
    }
  };

  return (
    <button type="button" onClick={handleOAuthBtnClick}>
      {oauthServerSvg}
    </button>
  );
};

export default OAuthBtn;
