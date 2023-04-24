import { atomFamily } from 'recoil';

const IsTitleEditFamily = atomFamily<boolean, number>({
  key: 'isTitleEditFamily',
  default: false,
});

export default IsTitleEditFamily;
