import { useQuery, useQueryClient } from '@tanstack/react-query';

import HTTP from '@/api';
import { IUserProfile } from '@/api/user';
import defaultProfileImg from '@/assets/defaultProfileImg.png';

interface IUseGetUserProfileParam {
  userId: IUserProfile['id'];
  selectKey?: keyof IUserProfile;
}

// TODO: API 명세서 확인 후 서버에러일 경우 initial data 로 처리하는 로직 확인.
const useGetUserProfile = (param: IUseGetUserProfileParam) => {
  const queryClient = useQueryClient();
  return useQuery(['userProfile'], () => HTTP.getUserProfile(param.userId), {
    staleTime: Infinity,
    select: data => {
      return param.selectKey ? data[param.selectKey] : data;
    },
    suspense: true,
    onError: () => {
      queryClient.setQueryData(['userProfile'], () => {
        return {
          id: param.userId,
          name: '여행가',
          profileImageURL: defaultProfileImg,
          authProvider: '',
          role: 'MEMBER',
        };
      });
    },
  });
};

export default useGetUserProfile;
