import {
  getLoginUri,
  getAccessToken,
  logout,
  refreshAccessToken,
  checkRefreshToken,
  resign,
} from '@/api/oauth';
import {
  getDailyPlanList,
  getTempPlanList,
  getTempPlanList1,
} from '@/api/plan';
import {
  createSchedule,
  changeScheduleOrder,
  deleteSchedule,
  getScheduleDetails,
  changeScheduleDetails,
} from '@/api/schedule';
import {
  getTripList,
  changeTripTitle,
  changeTripImg,
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
  changeTripImg,
  createTrip,
  deleteTrip,
  getDailyPlanList,
  getTempPlanList,
  getTempPlanList1,
  createSchedule,
  changeScheduleOrder,
  deleteSchedule,
  getScheduleDetails,
  changeScheduleDetails,
};

export default HTTP;
