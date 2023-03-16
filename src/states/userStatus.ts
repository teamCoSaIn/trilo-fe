import { atom } from 'recoil';

export const enum UserStatusTypes {
  LOGIN = 'login',
  VISITOR = 'visitor',
  LOGOUT = 'logout',
}

const UserStatus = atom<UserStatusTypes>({
  key: 'userStatus',
  default: UserStatusTypes.LOGOUT,
});

export default UserStatus;
