/* eslint-disable import/no-cycle */
import Axios from 'axios';

import { refreshAccessToken, TToken } from '@/api/oauth';
import isAccessTokenExpired from '@/utils/auth';

const BASE_URL = process.env.API_SERVER;

const axios = Axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

let isAxiosPause = false;
const axiosStack: ((token: TToken) => void)[] = [];

axios.interceptors.request.use(
  async config => {
    const newConfig = { ...config };

    // Access token이 필요한 요청 처리
    if (newConfig.requireAuth) {
      const accessToken = axios.defaults.headers.common.Authorization;
      // Access token 만료 여부 체크
      if (
        (typeof accessToken === 'string' &&
          isAccessTokenExpired(accessToken)) ||
        !accessToken
      ) {
        try {
          // 갱신 중 다른 갱신 요청 방지
          if (isAxiosPause) {
            // 요청 담기
            return await new Promise(resolve => {
              axiosStack.push((newAccessToken: TToken) => {
                newConfig.headers.Authorization = `Bearer ${newAccessToken}`;
                resolve(newConfig);
              });
            });
          }

          // Access token 갱신 요청
          isAxiosPause = true;
          const { access_token: newAccessToken } = await refreshAccessToken();
          isAxiosPause = false;

          // Access Token 만료 후 첫 요청의 Header에 새로운 Access Token을 저장
          newConfig.headers.Authorization = `Bearer ${newAccessToken}`;

          if (axiosStack.length) {
            axiosStack.forEach(axiosResolve => {
              return axiosResolve(newAccessToken);
            });
            axiosStack.length = 0;
          }
        } catch (e) {
          // Refresh token 이 만료되는 경우 -> 로그인페이지로 연결?
          throw new Error(
            'access token is expired and could not get it refreshed'
          );
        }
      }

      return newConfig;
    }

    // Access token이 필요 없는 요청 처리
    delete newConfig.headers.Authorization;
    return newConfig;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    if (response.data?.access_token) {
      axios.defaults.headers.common.Authorization = `Bearer ${response.data.access_token}`;
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios;
