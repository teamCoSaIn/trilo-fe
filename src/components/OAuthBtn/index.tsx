import { useQuery } from '@tanstack/react-query';
import { ReactElement } from 'react';

import HTTP from '@/api';

interface OAuthBtnProps {
  oauthServerName: string;
  oauthServerSvg: ReactElement;
}

const OAuthBtn = ({ oauthServerName, oauthServerSvg }: OAuthBtnProps) => {
  const { data: header } = useQuery(
    [`login-uri-${oauthServerName}`],
    () => HTTP.getLoginUri(oauthServerName),
    {
      suspense: true,
      staleTime: 1000 * 5 * 60,
    }
  );

  // TODO: 백엔드 api 연동 후 Auth-Url로 변경
  const handleOAuthBtnClick = () => {
    if (header && header['auth-url']) {
      window.location.href = header['auth-url'];
    }
  };

  return (
    <button type="button" onClick={handleOAuthBtnClick}>
      {oauthServerSvg}
    </button>
  );
};

export default OAuthBtn;
