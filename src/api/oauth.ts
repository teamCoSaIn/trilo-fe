import client from '@/api/core';

const loginUri = async <Response = unknown>() => {
  const res = await client<Response>({
    method: 'get',
    url: `/oauth-loginUrl/`,
  });
  return res.data;
};

const OAUTH_API = {
  LoginUri: loginUri,
};

export default OAUTH_API;
