import {
  getLoginUri,
  getAccessToken,
  logout,
  refreshAccessToken,
  checkRefreshToken,
} from '@/api/oauth';
import { getTripList, changeTripCardTitle } from '@/api/tripList';
import { getUserProfile, changeNickname, getUserInfo } from '@/api/userInfo';

const HTTP = {
  getLoginUri,
  getAccessToken,
  logout,
  refreshAccessToken,
  checkRefreshToken,
  getUserProfile,
  changeNickname,
  getUserInfo,
  getTripList,
  changeTripCardTitle,
};

export default HTTP;
