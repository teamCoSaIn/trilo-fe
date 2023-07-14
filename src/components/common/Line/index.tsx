/* eslint-disable @typescript-eslint/no-shadow */
import styled, { css } from 'styled-components';

import color from '@/constants/color';

const Line = styled.div<{
  width: number | 'fit';
  right?: number;
  left?: number;
  color?: string;
}>`
  height: 1px;
  border-top: 1px solid ${color.gray1};
  ${({ width, left, right, color }) => css`
    width: ${width === 'fit' ? '100%' : `${width}px`};
    ${left && `margin-left: ${left}px`}
    ${right && `margin-right: ${right}px`}
    ${color && `border-color: ${color}`}
  `}
`;

export default Line;
