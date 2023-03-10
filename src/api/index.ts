import {
  getLoginUri,
  getAccessToken,
  logout,
  refreshAccessToken,
  checkRefreshToken,
} from '@/api/oauth';

const HTTP = {
  getLoginUri,
  getAccessToken,
  logout,
  refreshAccessToken,
  checkRefreshToken,
};

export default HTTP;
