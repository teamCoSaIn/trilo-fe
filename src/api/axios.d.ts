import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    requireAuth?: boolean;
  }
}
