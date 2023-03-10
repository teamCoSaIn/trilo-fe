import { atom } from 'recoil';

export const enum UserStatusTypes {
  LOGIN = 'login',
  VISITOR = 'visitor',
  NONE = 'none',
}

const UserStatus = atom<UserStatusTypes>({
  key: 'userStatus',
  default: UserStatusTypes.NONE,
});

export default UserStatus;
