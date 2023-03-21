import { atom } from 'recoil';

import defaultProfileImg from '../assets/defaultProfileImg.png';

const UserProfileNickname = atom<string>({
  key: 'userProfileNickname',
  default: '여행가',
});

const UserProfileImgUrl = atom<string>({
  key: 'userProfileImgUrl',
  default: defaultProfileImg,
});

export { UserProfileNickname, UserProfileImgUrl };
