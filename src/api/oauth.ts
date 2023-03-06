import axios from '@/api/core';

// 백엔드 서버에 OAuth 로그인 url 요청
export const getLoginUri = async <Response = unknown>() => {
  const res = await axios<Response>({
    method: 'get',
    url: `/oauth-loginUrl/`,
  });
  return res.data;
};

// oauth code를 백엔드에 전송해서 access token(& refresh token)을 요청
export const getAccessToken = async <Response = unknown>(oauthCode: string) => {
  const res = await axios<Response>({
    method: 'get',
    url: `/oauth-login?code=${oauthCode}`,
  });
  return res.data;
};

// 만료된 액세스 토큰을 새로 고침하는 함수
// export const refreshAccessToken = async <Response = unknown>() => {
//   const res = await axios<Response>({
//     method: 'get',
//     url: ``,
//   });
//   return res.data;
// };
