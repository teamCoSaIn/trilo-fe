import {
  getLoginUri,
  getAccessToken,
  logout,
  refreshAccessToken,
  checkRefreshToken,
  resign,
} from '@/api/oauth';
import {
  getPlanCardDataList,
  changePlanCardTitle,
  createPlanCard,
  deletePlanCard,
} from '@/api/planCard';
import { getPlanDayList } from '@/api/planDay';
import {
  createSchedule,
  changeScheduleOrder,
  deleteSchedule,
} from '@/api/schedule';
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
  getPlanCardDataList,
  changePlanCardTitle,
  createPlanCard,
  deletePlanCard,
  getPlanDayList,
  createSchedule,
  changeScheduleOrder,
  deleteSchedule,
};

export default HTTP;
