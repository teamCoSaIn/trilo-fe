import {
  getLoginUri,
  getAccessToken,
  logout,
  refreshAccessToken,
  checkRefreshToken,
} from '@/api/oauth';
import {
  getTripList,
  changeTripCardTitle,
  createTripCard,
  deleteTripCard,
} from '@/api/tripList';
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
  createTripCard,
  deleteTripCard,
};

export default HTTP;
