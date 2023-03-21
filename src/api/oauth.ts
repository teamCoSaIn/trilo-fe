// eslint-disable-next-line import/no-cycle
import axios from '@/api/core';

interface AccessTokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  scope: string;
  refresh_token: string;
}

interface CheckRefreshTokenResponse {
  response?: boolean;
}

interface LogoutResponse {
  response?: boolean;
}

interface UserProfile {
  nickname: string;
  imgUrl: string;
}

// 백엔드 서버에 OAuth 로그인 url 요청
export const getLoginUri = async (oauthServer: string) => {
  const res = await axios<string>({
    method: 'get',
    url: `/oauth-loginUrl/${oauthServer}`,
    requireAuth: false,
  });
  return res.data;
};

// oauth code를 백엔드에 전송해서 access token(& refresh token)을 요청
export const getAccessToken = async (oauthCode: string) => {
  const res = await axios<AccessTokenResponse>({
    method: 'get',
    url: `/oauth-login?code=${oauthCode}`,
    requireAuth: false,
  });
  return res.data;
};

// 만료된 액세스 토큰을 새로 고침하는 함수
export const refreshAccessToken = async () => {
  const res = await axios<AccessTokenResponse>({
    method: 'get',
    url: `/auth/regeneration`,
    requireAuth: false,
  });
  return res.data;
};

export const checkRefreshToken = async () => {
  const res = await axios<CheckRefreshTokenResponse>({
    method: 'get',
    url: `/auth/check`,
    requireAuth: false,
  });
  return res.data;
};

export const logout = async () => {
  const res = await axios<LogoutResponse>({
    method: 'get',
    url: `/auth/logout`,
    requireAuth: false,
  });
  delete axios.defaults.headers.common.Authorization;
  return res.data;
};

export const getUserProfile = async () => {
  const res = await axios<UserProfile>({
    method: 'get',
    url: `/user-profile`,
    requireAuth: true,
  });
  return res.data;
};
