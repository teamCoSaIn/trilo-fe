import { useQuery, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api';
import { IUserProfile } from '@/api/userInfo';
import defaultProfileImg from '@/assets/defaultProfileImg.png';

export const initialUserProfile: IUserProfile = {
  nickname: '여행가',
  imgUrl: defaultProfileImg,
};

interface IUseGetUserProfileParam {
  selectKey?: keyof IUserProfile;
}

// TODO: API 명세서 확인 후 서버에러일 경우 initial data 로 처리하는 로직 확인.
const useGetUserProfile = (param: IUseGetUserProfileParam) => {
  const queryClient = useQueryClient();
  return useQuery(['userProfile'], () => HTTP.getUserProfile(), {
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 10,
    select: data => {
      return param.selectKey ? data[param.selectKey] : data;
    },
    suspense: true,
    onError: () => {
      queryClient.setQueryData(['userProfile'], () => initialUserProfile);
    },
  });
};

export default useGetUserProfile;
