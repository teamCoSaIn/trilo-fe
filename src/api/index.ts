import { getLocation } from '@/api/location';
import {
  getAccessToken,
  logout,
  refreshAccessToken,
  checkRefreshToken,
} from '@/api/oauth';
import { getDailyPlanList, getTempPlanList, changeDayColor } from '@/api/plan';
import {
  createSchedule,
  changeScheduleOrder,
  deleteSchedule,
  getScheduleDetails,
  changeScheduleDetails,
} from '@/api/schedule';
import {
  getTrip,
  getTripList,
  changeTripTitle,
  changeTripPeriod,
  changeTripImg,
  createTrip,
  deleteTrip,
} from '@/api/trip';
import {
  getUserProfile,
  changeNickname,
  getUserInfo,
  resign,
} from '@/api/user';

const HTTP = {
  getAccessToken,
  logout,
  refreshAccessToken,
  checkRefreshToken,
  resign,
  getUserProfile,
  changeNickname,
  getUserInfo,
  getTrip,
  getTripList,
  changeTripTitle,
  changeTripPeriod,
  changeTripImg,
  createTrip,
  deleteTrip,
  getDailyPlanList,
  getTempPlanList,
  changeDayColor,
  createSchedule,
  changeScheduleOrder,
  deleteSchedule,
  getScheduleDetails,
  changeScheduleDetails,
  getLocation,
};

export default HTTP;
