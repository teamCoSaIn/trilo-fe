import axios from '@/api/core';

interface OAuthUriResponse {
  id: number;
  name: string;
  url: string;
}

interface AccessTokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  scope: string;
  refresh_token: string;
}

// 백엔드 서버에 OAuth 로그인 url 요청
export const getLoginUri = async () => {
  const res = await axios<OAuthUriResponse[]>({
    method: 'get',
    url: `/oauth-loginUrl/`,
  });
  return res.data;
};

// oauth code를 백엔드에 전송해서 access token(& refresh token)을 요청
export const getAccessToken = async (oauthCode: string) => {
  const res = await axios<AccessTokenResponse>({
    method: 'get',
    url: `/oauth-login?code=${oauthCode}`,
  });
  axios.defaults.headers.common.Authorization = `Bearer ${res.data.access_token}`;
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
