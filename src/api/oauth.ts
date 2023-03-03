import client from '@/api/core';

const loginUri = async <Response = unknown>(authorizationServer: string) => {
  const res = await client<Response>({
    method: 'get',
    url: `/oauth-login/${authorizationServer}`,
  });
  return res.data;
};

const OAUTH_API = {
  LoginUri: loginUri,
};

export default OAUTH_API;
