import { useQuery } from '@tanstack/react-query';

import HTTP from '@/api';
import OAuthBtn from '@/pages/Login/OAuthBtn';

interface OAuthUri {
  [name: string]: string;
}

const OAuthBtnContainer = () => {
  const { data: authUrl } = useQuery(['login-uri'], () =>
    OAUTH_API.LoginUri<OAuthUri>()
  );

  const OAuthBtnList = !authUrl
    ? null
    : Object.keys(authUrl).map((name: keyof OAuthUri) => {
        return (
          <OAuthBtn
            key={name}
            authorizationServer={name as string}
            authUrl={authUrl[name]}
          />
        );
      });
  return <div>{OAuthBtnList}</div>;
};

export default OAuthBtnContainer;
