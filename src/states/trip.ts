import { atomFamily } from 'recoil';

export const IsTitleEditFamily = atomFamily<boolean, number>({
  key: 'isTitleEditFamily',
  default: false,
});

export const IsOptionOpenFamily = atomFamily<boolean, number>({
  key: 'isOptionOpenFamily',
  default: false,
});

export const PreviewImgFamily = atomFamily<string, number>({
  key: 'previewImgFamily',
  default: undefined,
});
