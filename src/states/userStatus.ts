import { atom } from 'recoil';

import { ITrip } from '@/api/trip';

export const enum UserStatusTypes {
  LOGIN = 'login',
  VISITOR = 'visitor',
  LOGOUT = 'logout',
}

const UserStatus = atom<UserStatusTypes>({
  key: 'userStatus',
  default: UserStatusTypes.LOGOUT,
});

export const UserId = atom<ITrip['tripperId']>({
  key: 'userId',
  default: undefined,
});

export default UserStatus;
