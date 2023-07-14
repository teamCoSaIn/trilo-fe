import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { IUserProfile } from '@/api/user';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
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
      <Box alignCenter>
        <UserProfileImg
          profileImgUrl={(userProfileData as IUserProfile).profileImageURL}
        />
        <Spacing width={7} />
        <UserProfileNickname
          fontSize={1.6}
          color="#3867ff"
          title={(userProfileData as IUserProfile).nickName}
        >
          {(userProfileData as IUserProfile).nickName}
        </UserProfileNickname>
        <NicknameDescription fontSize={1.6} color="#3867ff">
          님
        </NicknameDescription>
      </Box>
    );
  }

  return null;
};

const Box = styled(Flex)`
  width: 100%;
`;

const UserProfileImg = styled.img<{ profileImgUrl: string }>`
  flex-shrink: 0;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NicknameDescription = styled(Description)`
  @media screen and (max-width: 350px) {
    display: none;
  }
  padding-right: 20px;
`;

export default SideMenuProfile;
