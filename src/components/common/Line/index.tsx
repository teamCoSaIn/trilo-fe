import styled, { css } from 'styled-components';

import color from '@/constants/color';

const Line = styled.div<{ width?: number; right?: number; left?: number }>`
  height: 1px;
  border-top: 1px solid ${color.gray1};
  ${props => css`
    ${props.width && { width: props.width }}
    ${props.left && { marginLeft: props.left }}
    ${props.right && { marginRight: props.right }}
  `}
`;

export default Line;