import { ReactElement } from 'react';

interface IOAuthBtnProps {
  oauthServerName: string;
  oauthServerSvg: ReactElement;
  oauthServerLoginUri: string;
}

const OAuthBtn = ({
  oauthServerName,
  oauthServerSvg,
  oauthServerLoginUri,
}: IOAuthBtnProps) => {
  const handleOAuthLinkClick = () => {
    localStorage.setItem('oauthServerName', oauthServerName);
  };
  return (
    <a onClick={handleOAuthLinkClick} href={oauthServerLoginUri}>
      {oauthServerSvg}
    </a>
  );
};

export default OAuthBtn;
