import axios from '@/api/core';

// 백엔드 서버에 OAuth 로그인 url 요청
export const getLoginUri = async <Response = unknown>() => {
  const res = await axios<Response>({
    method: 'get',
    url: `/oauth-loginUrl/`,
  });
  return res.data;
};

const OAUTH_API = {
  LoginUri: loginUri,
};

export default OAUTH_API;
