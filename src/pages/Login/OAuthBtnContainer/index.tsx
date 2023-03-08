import { useQuery } from '@tanstack/react-query';

import HTTP from '@/api';
import OAuthBtn from '@/pages/Login/OAuthBtn';

const OAuthBtnContainer = () => {
  const { data: authUrl } = useQuery(['login-uri'], () => HTTP.getLoginUri(), {
    suspense: true,
  });

  const OAuthBtnList = !authUrl
    ? null
    : authUrl.map(({ id, name, url }) => {
        return <OAuthBtn key={id} authorizationServer={name} authUrl={url} />;
      });
  return <div>{OAuthBtnList}</div>;
};

export default OAuthBtnContainer;