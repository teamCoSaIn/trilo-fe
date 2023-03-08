import Axios from 'axios';

import { refreshAccessToken } from '@/api/oauth';
import isAccessTokenExpired from '@/utils/auth';

const BASE_URL = process.env.API_SERVER;

const axios = Axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

axios.interceptors.request.use(
  config => {
    const newConfig = { ...config };

    if (config.requireAuth) {
      const accessToken = axios.defaults.headers.common.Authorization;
      if (
        typeof accessToken === 'string' &&
        isAccessTokenExpired(accessToken)
      ) {
        refreshAccessToken();
      }
      return config;
    }

    delete newConfig.headers.Authorization;

    return newConfig;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios;
