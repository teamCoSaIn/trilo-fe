/* eslint-disable import/no-cycle */
import axios from '@/api/core';

export type TToken = string;

interface IGetAccessTokenResponse {
  authType: string;
  accessToken: TToken;
}

interface IGetLoginUriResponse {
  uri: string;
}

interface ICheckRefreshTokenResponse {
  availability: boolean;
}

interface IResignResponse {
  response?: boolean;
}

// 백엔드 서버에 OAuth 로그인 url 요청
export const getLoginUri = async (oauthServer: string) => {
  const res = await axios<IGetLoginUriResponse>({
    method: 'get',
    url: `/auth/login/${oauthServer}`,
    requireAuth: false,
  });
  return res.data;
};

// oauth code를 백엔드에 전송해서 access token(& refresh token)을 요청
export const getAccessToken = async (oauthCode: string, oauthState: string) => {
  const res = await axios<IGetAccessTokenResponse>({
    method: 'get',
    url: `/auth/login/oauth2/code?code=${oauthCode}&state=${oauthState}`,
    requireAuth: false,
  });
  return res.data;
};

// 만료된 액세스 토큰을 새로 고침하는 함수
export const refreshAccessToken = async () => {
  const res = await axios<IGetAccessTokenResponse>({
    method: 'post',
    url: `/auth/reissue`,
    requireAuth: false,
  });
  return res.data;
};

export const checkRefreshToken = async () => {
  const res = await axios<ICheckRefreshTokenResponse>({
    method: 'get',
    url: `/auth/token/refresh-token-info`,
    requireAuth: false,
  });
  return res.data;
};

export const logout = async () => {
  const res = await axios({
    method: 'post',
    url: `/auth/logout`,
    requireAuth: true,
  });
  delete axios.defaults.headers.common.Authorization;
  return res.status;
};

export const resign = async () => {
  const res = await axios<IResignResponse>({
    method: 'get',
    url: `/auth/resign`,
    requireAuth: true,
  });
  delete axios.defaults.headers.common.Authorization;
  return res.data;
};
