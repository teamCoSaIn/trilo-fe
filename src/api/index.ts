import {
  getLoginUri,
  getAccessToken,
  logout,
  refreshAccessToken,
  checkRefreshToken,
} from '@/api/oauth';
import {
  getPlanCardDataList,
  changePlanCardTitle,
  createPlanCard,
  deletePlanCard,
} from '@/api/planCard';
import { getPlanDayList } from '@/api/planDay';
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
  getPlanCardDataList,
  changePlanCardTitle,
  createPlanCard,
  deletePlanCard,
  getPlanDayList,
};

export default HTTP;
