import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    requireAuth?: boolean;
  }

  // TODO: 백엔드 api 연동 후 Auth-Url로 변경
  export interface RawAxiosHeaders {
    ['auth-url']?: string;
  }
}
