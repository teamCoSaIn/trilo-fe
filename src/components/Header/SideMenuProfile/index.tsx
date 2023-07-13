import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { IUserProfile } from '@/api/user';
import Description from '@/components/common/Description';
import Spacing from '@/components/common/Spacing';
import useGetUserProfile from '@/queryHooks/useGetUserProfile';
import { UserId } from '@/states/userStatus';

const SideMenuProfile = () => {
  const userId = useRecoilValue(UserId);

  const { data: userProfileData, isSuccess } = useGetUserProfile({
    userId,
  });

  if (isSuccess) {
    return (
      <>
        <UserProfileImg
          profileImgUrl={(userProfileData as IUserProfile).profileImageURL}
        />
        <Spacing width={7} />
        <UserProfileNickname fontSize={1.6} color="#3867ff">
          {(userProfileData as IUserProfile).nickName} 님
        </UserProfileNickname>
      </>
    );
  }

  return null;
};

const UserProfileImg = styled.img<{ profileImgUrl: string }>`
  width: 39px;
  height: 39px;
  border-radius: 50%;
  background-image: url(${props => props.profileImgUrl});
  background-size: cover;
`;

const UserProfileNickname = styled(Description)`
  @media screen and (max-width: 350px) {
    display: none;
  }
`;

export default SideMenuProfile;
