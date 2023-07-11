import { css } from 'styled-components';

import color from '@/constants/color';

export const largeBtnStyle = css`
  width: 568px;
  height: 82px;
  border-radius: 41px;
  font-size: 2.3rem;
`;

export const mediumBtnStyle = css`
  width: 152px;
  height: 36px;
  border-radius: 24px;
  font-size: 1.6rem;
`;

export const smallBtnStyle = css`
  width: 68px;
  height: 35px;
  border-radius: 18px;
  font-size: 1.4rem;
`;

export const blueBtnStyle = css`
  background-color: ${color.blue3};
  color: ${color.white};
  border: 1px solid ${color.blue3};
  &:hover {
    background-color: ${color.blue4};
    border: 1px solid ${color.blue4};
  }
  &:disabled {
    background-color: ${color.gray2};
    border: 1px solid ${color.gray2};
  }
`;

export const whiteBtnStyle = css`
  background-color: ${color.white};
  color: ${color.blue2};
  border: 1px solid ${color.blue2};
  &:hover {
    color: ${color.blue3};
    border: 1px solid ${color.blue3};
  }
`;

export const grayBtnStyle = css`
  background-color: ${color.white};
  color: ${color.gray2};
  border: 1px solid ${color.gray2};
`;
