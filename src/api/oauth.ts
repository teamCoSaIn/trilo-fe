/* eslint-disable import/no-cycle */
import axios from '@/api/core';

export type TToken = string;

export interface IGetAccessTokenResponse {
  authType: string;
  accessToken: TToken;
}

interface ICheckRefreshTokenResponse {
  availability: boolean;
}

export interface IGetAccessTokenParams {
  oauthServerName: string;
  oauthData: {
    code: string;
    redirect_uri?: string;
    state?: string;
  };
}

// oauth code를 백엔드에 전송해서 access token(& refresh token)을 요청
export const getAccessToken = async ({
  oauthServerName,
  oauthData,
}: IGetAccessTokenParams) => {
  const res = await axios<IGetAccessTokenResponse>({
    method: 'post',
    url: `/auth/login/${oauthServerName}`,
    data: oauthData,
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
