import {
  getLoginUri,
  getAccessToken,
  logout,
  refreshAccessToken,
  checkRefreshToken,
  resign,
} from '@/api/oauth';
import { getPlanDayList } from '@/api/planDay';
import {
  createSchedule,
  changeScheduleOrder,
  deleteSchedule,
} from '@/api/schedule';
import {
  getTripList,
  changeTripTitle,
  createTrip,
  deleteTrip,
} from '@/api/trip';
import { getUserProfile, changeNickname, getUserInfo } from '@/api/userInfo';

const HTTP = {
  getLoginUri,
  getAccessToken,
  logout,
  refreshAccessToken,
  checkRefreshToken,
  resign,
  getUserProfile,
  changeNickname,
  getUserInfo,
  getTripList,
  changeTripTitle,
  createTrip,
  deleteTrip,
  getPlanDayList,
  createSchedule,
  changeScheduleOrder,
  deleteSchedule,
};

export default HTTP;
